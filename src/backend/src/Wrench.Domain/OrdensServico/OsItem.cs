using Wrench.Domain.Common;

namespace Wrench.Domain.OrdensServico;

/// <summary>
/// Item de uma Ordem de Serviço. Pode ser peça (com baixa de estoque) ou
/// serviço (mão de obra). Snapshot do nome/código no momento da inclusão
/// — preserva histórico mesmo se a peça for renomeada depois.
///
/// Mapeamento das colunas do Excel:
/// - subtotal = coluna H (=PRODUCT(qtd, preço))
/// - maoDeObra = coluna I (serviço)
/// - valorFinal = coluna J (=SUM(H, I))
/// </summary>
public sealed class OsItem : Entity
{
    public Guid OrdemServicoId { get; private set; }

    public OsItemTipo Tipo { get; private set; } = default!;

    /// <summary>FK para Peca (se tipo=Peca).</summary>
    public Guid? PecaId { get; private set; }

    /// <summary>FK para Servico (se tipo=Servico).</summary>
    public Guid? ServicoId { get; private set; }

    /// <summary>Nome legível (snapshot).</summary>
    public string Nome { get; private set; } = default!;

    /// <summary>Código legível (snapshot, só peça).</summary>
    public string? Codigo { get; private set; }

    /// <summary>Compartimento/gaveta (snapshot, só peça).</summary>
    public string? Compartimento { get; private set; }

    public int Quantidade { get; private set; }
    public decimal PrecoUnitario { get; private set; }

    /// <summary>= quantidade × precoUnitario (coluna H do Excel).</summary>
    public decimal Subtotal { get; private set; }

    /// <summary>Valor da mão de obra do item (coluna I do Excel).</summary>
    public decimal MaoDeObra { get; private set; }

    /// <summary>= subtotal + maoDeObra (coluna J do Excel).</summary>
    public decimal ValorFinal { get; private set; }

    private OsItem() { }

    internal OsItem(
        Guid id,
        OsItemTipo tipo,
        string nome,
        int quantidade,
        decimal precoUnitario,
        decimal maoDeObra,
        Guid? pecaId = null,
        Guid? servicoId = null,
        string? codigo = null,
        string? compartimento = null)
        : base(id)
    {
        Tipo = tipo;
        Nome = nome;
        Quantidade = quantidade;
        PrecoUnitario = precoUnitario;
        MaoDeObra = maoDeObra;
        PecaId = pecaId;
        ServicoId = servicoId;
        Codigo = codigo;
        Compartimento = compartimento;
        Subtotal = quantidade * precoUnitario;
        ValorFinal = Subtotal + MaoDeObra;
    }
}
