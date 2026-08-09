using ErrorOr;
using Wrench.Domain.Common;

namespace Wrench.Domain.Catalogo;

/// <summary>
/// Aggregate Root de Serviço (mão de obra do catálogo).
/// Substitui as linhas "M.O" do Excel (coluna I).
/// </summary>
public sealed class Servico : AggregateRoot
{
    public string Codigo { get; private set; } = default!;
    public string Nome { get; private set; } = default!;
    public string? Descricao { get; private set; }
    public string Categoria { get; private set; } = default!;
    public decimal ValorBase { get; private set; }

    /// <summary>Tempo estimado de execução em minutos.</summary>
    public int? TempoEstimadoMin { get; private set; }

    public bool Ativo { get; private set; } = true;

    private Servico() { }

    public static ErrorOr<Servico> Criar(
        string codigo,
        string nome,
        string categoria,
        decimal valorBase,
        int? tempoEstimadoMin = null,
        string? descricao = null)
    {
        if (string.IsNullOrWhiteSpace(codigo)) return ServicoErrors.CodigoObrigatorio;
        if (string.IsNullOrWhiteSpace(nome)) return ServicoErrors.NomeObrigatorio;
        if (valorBase < 0) return ServicoErrors.ValorBaseInvalido;

        return new Servico
        {
            Id = Guid.CreateVersion7(),
            Codigo = codigo.Trim().ToUpperInvariant(),
            Nome = nome.Trim(),
            Categoria = categoria.Trim(),
            ValorBase = valorBase,
            TempoEstimadoMin = tempoEstimadoMin,
            Descricao = descricao?.Trim(),
            Ativo = true,
        };
    }
}

/// <summary>Erros de domínio de Serviço.</summary>
public static class ServicoErrors
{
    public static Error CodigoObrigatorio =>
        Error.Validation("Servico.CodigoObrigatorio", "Código do serviço é obrigatório.");

    public static Error NomeObrigatorio =>
        Error.Validation("Servico.NomeObrigatorio", "Nome do serviço é obrigatório.");

    public static Error ValorBaseInvalido =>
        Error.Validation("Servico.ValorBaseInvalido", "Valor base não pode ser negativo.");

    public static Error NaoEncontrado(Guid id) =>
        Error.NotFound("Servico.NaoEncontrado", $"Serviço {id} não encontrado.");
}
