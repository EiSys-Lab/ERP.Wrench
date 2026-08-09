using Ardalis.SmartEnum;

namespace Wrench.Domain.OrdensServico;

/// <summary>Tipo de item de OS: Peça (baixa estoque) ou Serviço (mão de obra).</summary>
public sealed class OsItemTipo : SmartEnum<OsItemTipo>
{
    public static readonly OsItemTipo Peca = new("Peca", 1);
    public static readonly OsItemTipo Servico = new("Servico", 2);

    private OsItemTipo(string name, int value) : base(name, value) { }
}

/// <summary>Status de pagamento da OS.</summary>
public sealed class PagamentoStatus : SmartEnum<PagamentoStatus>
{
    public static readonly PagamentoStatus Pendente = new("Pendente", 1);
    public static readonly PagamentoStatus Pago = new("Pago", 2);
    public static readonly PagamentoStatus Parcial = new("Parcial", 3);
    public static readonly PagamentoStatus Isento = new("Isento", 4);

    private PagamentoStatus(string name, int value) : base(name, value) { }
}
