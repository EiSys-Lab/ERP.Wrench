namespace Wrench.Domain.Common;

/// <summary>
/// Repositório genérico para agregar raiz. Sem SaveChanges (delegado ao
/// IUnitOfWork). Crie interfaces específicas só quando há queries complexas
/// que valem isolar.
/// </summary>
/// <typeparam name="TAggregate">O agregado raiz gerenciado.</typeparam>
public interface IRepository<TAggregate> where TAggregate : AggregateRoot
{
    Task<TAggregate?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<TAggregate>> ListAsync(CancellationToken ct = default);
    Task AddAsync(TAggregate aggregate, CancellationToken ct = default);
    void Update(TAggregate aggregate);
    void Remove(TAggregate aggregate);
}
