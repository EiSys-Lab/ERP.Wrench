namespace Wrench.Domain.Common;

/// <summary>
/// Raiz de agregado — única entrada de mudança de estado consistente.
/// Acumula DomainEvents que são despachados após o SaveChanges do UnitOfWork.
/// </summary>
public abstract class AggregateRoot : Entity
{
    private readonly List<IDomainEvent> _events = [];

    protected AggregateRoot() { }
    protected AggregateRoot(Guid id) : base(id) { }

    /// <summary>Snapshot read-only dos eventos pendentes — para o UoW publicar.</summary>
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _events.AsReadOnly();

    /// <summary>Enfileira evento para publicação pós-commit.</summary>
    protected void Raise(IDomainEvent @event) => _events.Add(@event);

    /// <summary>Chamado pelo UnitOfWork após publicar todos os eventos.</summary>
    public void ClearDomainEvents() => _events.Clear();
}
