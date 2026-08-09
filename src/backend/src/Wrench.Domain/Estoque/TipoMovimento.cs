using Ardalis.SmartEnum;

namespace Wrench.Domain.Estoque;

/// <summary>Tipo de movimento de estoque.</summary>
public sealed class TipoMovimento : SmartEnum<TipoMovimento>
{
    public static readonly TipoMovimento Entrada = new("Entrada", 1);
    public static readonly TipoMovimento Saida = new("Saida", 2);
    public static readonly TipoMovimento AjustePositivo = new("AjustePositivo", 3);
    public static readonly TipoMovimento AjusteNegativo = new("AjusteNegativo", 4);
    public static readonly TipoMovimento Transferencia = new("Transferencia", 5);

    private TipoMovimento(string name, int value) : base(name, value) { }

    /// <summary>True se o movimento adiciona ao saldo (entrada ou ajuste positivo).</summary>
    public bool EhEntrada => this == Entrada || this == AjustePositivo;

    /// <summary>True se o movimento remove do saldo (saída ou ajuste negativo).</summary>
    public bool EhSaida => this == Saida || this == AjusteNegativo;
}
