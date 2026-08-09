using Ardalis.SmartEnum;
using ErrorOr;
using Wrench.Domain.Common;

namespace Wrench.Domain.Catalogo;

/// <summary>Unidade de medida de uma peça.</summary>
public sealed class UnidadeMedida : SmartEnum<UnidadeMedida>
{
    public static readonly UnidadeMedida Un = new("Un", 1);
    public static readonly UnidadeMedida Par = new("Par", 2);
    public static readonly UnidadeMedida Metro = new("Metro", 3);
    public static readonly UnidadeMedida Kg = new("Kg", 4);
    public static readonly UnidadeMedida Litro = new("Litro", 5);

    private UnidadeMedida(string name, int value) : base(name, value) { }
}

/// <summary>
/// Aggregate Root de Peça (catálogo de itens vendíveis/estocáveis).
/// Substitui as colunas A-D do Excel (código, compartimento, nome, estoque).
/// </summary>
public sealed class Peca : AggregateRoot
{
    public string Codigo { get; private set; } = default!;
    public string Nome { get; private set; } = default!;
    public string? Descricao { get; private set; }

    /// <summary>FK para CategoriaPeca (catálogo de categorias).</summary>
    public Guid? CategoriaId { get; private set; }

    /// <summary>Localização física (gaveta/balcão — coluna B do Excel).</summary>
    public string Compartimento { get; private set; } = default!;

    public UnidadeMedida Unidade { get; private set; } = UnidadeMedida.Un;

    public decimal Preco { get; private set; }
    public decimal? Custo { get; private set; }

    public int QuantidadeEstoque { get; private set; }
    public int EstoqueMinimo { get; private set; }
    public int? EstoqueMaximo { get; private set; }

    public string? CodigoBarras { get; private set; }
    public string? Ncm { get; private set; }

    public bool Ativo { get; private set; } = true;

    /// <summary>Margem calculada (se custo existir).</summary>
    public decimal? Margem => Custo is { } custo && Preco > 0 ? (Preco - custo) / Preco : null;

    /// <summary>True se estoque está abaixo ou igual ao mínimo.</summary>
    public bool AbaixoDoMinimo => QuantidadeEstoque <= EstoqueMinimo;

    private Peca() { }

    public static ErrorOr<Peca> Criar(
        string codigo,
        string nome,
        string compartimento,
        decimal preco,
        int estoqueMinimo = 5,
        UnidadeMedida? unidade = null,
        string? descricao = null,
        Guid? categoriaId = null,
        decimal? custo = null,
        int quantidadeEstoque = 0,
        int? estoqueMaximo = null,
        string? codigoBarras = null,
        string? ncm = null)
    {
        if (string.IsNullOrWhiteSpace(codigo)) return PecaErrors.CodigoObrigatorio;
        if (string.IsNullOrWhiteSpace(nome)) return PecaErrors.NomeObrigatorio;
        if (string.IsNullOrWhiteSpace(compartimento)) return PecaErrors.CompartimentoObrigatorio;
        if (preco < 0) return PecaErrors.PrecoInvalido;
        if (estoqueMinimo < 0) return PecaErrors.EstoqueMinimoInvalido;
        if (estoqueMaximo.HasValue && estoqueMaximo < estoqueMinimo)
            return PecaErrors.EstoqueMaximoMenorQueMinimo;

        return new Peca
        {
            Id = Guid.CreateVersion7(),
            Codigo = codigo.Trim().ToUpperInvariant(),
            Nome = nome.Trim(),
            Compartimento = compartimento.Trim(),
            Preco = preco,
            Custo = custo,
            EstoqueMinimo = estoqueMinimo,
            QuantidadeEstoque = quantidadeEstoque,
            EstoqueMaximo = estoqueMaximo,
            Unidade = unidade ?? UnidadeMedida.Un,
            Descricao = descricao?.Trim(),
            CategoriaId = categoriaId,
            CodigoBarras = codigoBarras?.Trim(),
            Ncm = ncm?.Trim(),
            Ativo = true,
        };
    }

    public void AtualizarPreco(decimal novoPreco)
    {
        if (novoPreco >= 0) Preco = novoPreco;
    }

    public void AdicionarEstoque(int quantidade)
    {
        if (quantidade > 0) QuantidadeEstoque += quantidade;
    }

    public ErrorOr<Success> DebitarEstoque(int quantidade)
    {
        if (quantidade <= 0) return PecaErrors.QuantidadeInvalida;
        if (QuantidadeEstoque < quantidade) return PecaErrors.EstoqueInsuficiente;
        QuantidadeEstoque -= quantidade;
        return Result.Success;
    }
}

/// <summary>Erros de domínio de Peça.</summary>
public static class PecaErrors
{
    public static Error CodigoObrigatorio =>
        Error.Validation("Peca.CodigoObrigatorio", "Código da peça é obrigatório.");

    public static Error NomeObrigatorio =>
        Error.Validation("Peca.NomeObrigatorio", "Nome da peça é obrigatório.");

    public static Error CompartimentoObrigatorio =>
        Error.Validation("Peca.CompartimentoObrigatorio", "Compartimento é obrigatório.");

    public static Error PrecoInvalido =>
        Error.Validation("Peca.PrecoInvalido", "Preço não pode ser negativo.");

    public static Error EstoqueMinimoInvalido =>
        Error.Validation("Peca.EstoqueMinimoInvalido", "Estoque mínimo não pode ser negativo.");

    public static Error EstoqueMaximoMenorQueMinimo =>
        Error.Validation("Peca.EstoqueMaximoMenorQueMinimo", "Estoque máximo não pode ser menor que o mínimo.");

    public static Error QuantidadeInvalida =>
        Error.Validation("Peca.QuantidadeInvalida", "Quantidade deve ser maior que zero.");

    public static Error EstoqueInsuficiente =>
        Error.Conflict("Peca.EstoqueInsuficiente", "Estoque insuficiente para esta operação.");

    public static Error NaoEncontrada(Guid id) =>
        Error.NotFound("Peca.NaoEncontrada", $"Peça {id} não encontrada.");
}
