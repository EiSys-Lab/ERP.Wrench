namespace Wrench.Domain.Common;

/// <summary>
/// Marker para eventos de domínio. São coletados pelo AggregateRoot e
/// publicados após o SaveChanges do UnitOfWork.
///
/// Não depende de MediatR — a Application adapta para INotification.
/// </summary>
public interface IDomainEvent
{
    Guid Id { get; }
    DateTimeOffset OccurredAt { get; }
}

/// <summary>
/// Base para eventos de domínio. Popula Id e OccurredAt automaticamente.
/// </summary>
public abstract record DomainEventBase : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTimeOffset OccurredAt { get; } = DateTimeOffset.UtcNow;
}
