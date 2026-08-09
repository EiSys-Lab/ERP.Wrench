using Ardalis.SmartEnum;

namespace Wrench.Domain.OrdensServico;

/// <summary>
/// Status de uma Ordem de Serviço (SmartEnum com comportamento de transição).
///
/// Fluxo principal: Aberta → Aprovada → EmExecucao → Pronta → Faturada → Entregue → Concluida.
/// Estágios excepcionais: AguardandoAprovacao, Cancelada (terminal).
/// </summary>
public sealed class OsStatus : SmartEnum<OsStatus>
{
    public static readonly OsStatus Aberta = new("Aberta", 1);
    public static readonly OsStatus AguardandoAprovacao = new("AguardandoAprovacao", 2);
    public static readonly OsStatus Aprovada = new("Aprovada", 3);
    public static readonly OsStatus EmExecucao = new("EmExecucao", 4);
    public static readonly OsStatus Pronta = new("Pronta", 5);
    public static readonly OsStatus Faturada = new("Faturada", 6);
    public static readonly OsStatus Entregue = new("Entregue", 7);
    public static readonly OsStatus Concluida = new("Concluida", 8);
    public static readonly OsStatus Cancelada = new("Cancelada", 99);

    private OsStatus(string name, int value) : base(name, value) { }

    /// <summary>True se o status é terminal (não pode mais avançar).</summary>
    public bool IsTerminal => this == Concluida || this == Cancelada;

    /// <summary>Próximo status no fluxo principal, ou null se terminal.</summary>
    public OsStatus? ProximoEstagio => this switch
    {
        _ when this == Aberta => Aprovada,
        _ when this == AguardandoAprovacao => Aprovada,
        _ when this == Aprovada => EmExecucao,
        _ when this == EmExecucao => Pronta,
        _ when this == Pronta => Faturada,
        _ when this == Faturada => Entregue,
        _ when this == Entregue => Concluida,
        _ => null,
    };

    /// <summary>Valida se pode transitar de <paramref name="atual"/> para <paramref name="destino"/>.</summary>
    public static bool PodeTransitarPara(OsStatus atual, OsStatus destino)
    {
        if (atual.IsTerminal) return false;
        if (atual == destino) return false;

        // Cancelada pode partir de qualquer não-terminal.
        if (destino == Cancelada) return true;

        // Fluxo principal: destino deve ser o próximo do atual.
        return atual.ProximoEstagio == destino;
    }
}
