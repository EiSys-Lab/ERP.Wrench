using Wrench.Domain.Common;

namespace Wrench.Domain.Identity;

/// <summary>
/// Repositório de User. Query cross-tenant (busca por email para login).
/// Implementado na Infrastructure com EF Core.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    void Update(User user);
}
