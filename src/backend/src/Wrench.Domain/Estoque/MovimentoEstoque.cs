using ErrorOr;
using Wrench.Domain.Common;
using Wrench.Domain.Estoque.Events;

namespace Wrench.Domain.Estoque;

/// <summary>
/// Aggregate Root imutável — trilha de auditoria de movimentos de estoque.
/// RN-002: movimentos nunca são alterados/excluídos; correções geram novo
/// movimento inverso. Snapshot do nome/código da peça no momento.
/// </summary>
public sealed class MovimentoEstoque : AggregateRoot
{
    public Guid PecaId { get; private set; }
    public string PecaCodigo { get; private set; } = default!;
    public string PecaNome { get; private set; } = default!;

    public TipoMovimento Tipo { get; private set; } = default!;
    public int Quantidade { get; private set; }
    public int SaldoAnterior { get; private set; }
    public int SaldoResultante { get; private set; }

    /// <summary>Origem (ex: "OS-0142", "NF-00482").</summary>
    public string? DocumentoOrigem { get; private set; }

    /// <summary>Motivo (obrigatório para ajustes manuais — RN-002).</summary>
    public string? Motivo { get; private set; }

    public string? OperadorNome { get; private set; }

    public DateTimeOffset DataMovimento { get; private set; }

    private MovimentoEstoque() { }

    /// <summary>
    /// Factory — cria um movimento imutável. Valida:
    /// - quantidade > 0
    /// - ajustes (positivo/negativo) exigem motivo
    /// - saldo resultante nunca pode ser negativo
    /// </summary>
    public static ErrorOr<MovimentoEstoque> Criar(
        Guid pecaId,
        string pecaCodigo,
        string pecaNome,
        TipoMovimento tipo,
        int quantidade,
        int saldoAnterior,
        string? documentoOrigem = null,
        string? motivo = null,
        string? operadorNome = null)
    {
        if (pecaId == Guid.Empty) return MovimentoErrors.PecaObrigatoria;
        if (string.IsNullOrWhiteSpace(pecaCodigo)) return MovimentoErrors.PecaCodigoObrigatorio;
        if (tipo is null) return MovimentoErrors.TipoObrigatorio;
        if (quantidade <= 0) return MovimentoErrors.QuantidadeInvalida;
        if (saldoAnterior < 0) return MovimentoErrors.SaldoAnteriorInvalido;

        // Ajustes exigem motivo (RN-002).
        var exigeMotivo = tipo == TipoMovimento.AjustePositivo || tipo == TipoMovimento.AjusteNegativo;
        if (exigeMotivo && string.IsNullOrWhiteSpace(motivo))
            return MovimentoErrors.MotivoObrigatorioParaAjuste;

        var saldoResultante = saldoAnterior + (tipo.EhEntrada ? quantidade : -quantidade);
        if (saldoResultante < 0) return MovimentoErrors.SaldoResultanteNegativo;

        var movimento = new MovimentoEstoque
        {
            Id = Guid.CreateVersion7(),
            PecaId = pecaId,
            PecaCodigo = pecaCodigo,
            PecaNome = pecaNome,
            Tipo = tipo,
            Quantidade = quantidade,
            SaldoAnterior = saldoAnterior,
            SaldoResultante = saldoResultante,
            DocumentoOrigem = documentoOrigem,
            Motivo = motivo?.Trim(),
            OperadorNome = operadorNome?.Trim(),
            DataMovimento = DateTimeOffset.UtcNow,
        };

        movimento.Raise(new EstoqueMovimentadoEvent(pecaId, tipo, quantidade, saldoResultante));
        return movimento;
    }
}

/// <summary>Erros de domínio de MovimentoEstoque.</summary>
public static class MovimentoErrors
{
    public static Error PecaObrigatoria =>
        Error.Validation("Movimento.PecaObrigatoria", "Peça é obrigatória.");

    public static Error PecaCodigoObrigatorio =>
        Error.Validation("Movimento.PecaCodigoObrigatorio", "Código da peça é obrigatório.");

    public static Error TipoObrigatorio =>
        Error.Validation("Movimento.TipoObrigatorio", "Tipo de movimento é obrigatório.");

    public static Error QuantidadeInvalida =>
        Error.Validation("Movimento.QuantidadeInvalida", "Quantidade deve ser maior que zero.");

    public static Error SaldoAnteriorInvalido =>
        Error.Validation("Movimento.SaldoAnteriorInvalido", "Saldo anterior não pode ser negativo.");

    public static Error MotivoObrigatorioParaAjuste =>
        Error.Validation("Movimento.MotivoObrigatorioParaAjuste", "Ajustes manuais exigem um motivo.");

    public static Error SaldoResultanteNegativo =>
        Error.Conflict("Movimento.SaldoResultanteNegativo", "Saldo resultante não pode ser negativo.");
}

/// <summary>Repositório de MovimentoEstoque (trilha, apenas leitura + insert).</summary>
public interface IMovimentoEstoqueRepository
{
    Task<IReadOnlyList<MovimentoEstoque>> ListByPecaAsync(Guid pecaId, CancellationToken ct = default);
    Task<IReadOnlyList<MovimentoEstoque>> ListRecentesAsync(int take, CancellationToken ct = default);
    Task AddAsync(MovimentoEstoque movimento, CancellationToken ct = default);
    Task<int> GetSaldoAtualAsync(Guid pecaId, CancellationToken ct = default);
}
