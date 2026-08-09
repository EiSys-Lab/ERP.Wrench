using Wrench.Domain.Common;

namespace Wrench.Domain.OrdensServico.Events;

/// <summary>
/// Evento disparado quando uma OS é criada. Pode disparar notificação ao
/// cliente, baixa de estoque (na finalização), etc.
/// </summary>
public sealed record OsCriadaEvent(
    Guid OrdemServicoId,
    Guid ClienteId,
    string VeiculoPlaca) : DomainEventBase;
