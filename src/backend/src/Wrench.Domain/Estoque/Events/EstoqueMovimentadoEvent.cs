using Wrench.Domain.Common;

namespace Wrench.Domain.Estoque.Events;

/// <summary>
/// Evento disparado quando o estoque de uma peça é movimentado.
/// Pode disparar recalculo de saldo, alertas de mínimo, etc.
/// </summary>
public sealed record EstoqueMovimentadoEvent(
    Guid PecaId,
    TipoMovimento Tipo,
    int Quantidade,
    int SaldoResultante) : DomainEventBase;
