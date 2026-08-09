using Microsoft.EntityFrameworkCore;
using Wrench.Domain.Identity;

namespace Wrench.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repositório de User (cross-tenant para login). Implementa IUserRepository.
/// </summary>
internal sealed class UserRepository : IUserRepository
{
    private readonly Persistence.WrenchDbContext _db;

    public UserRepository(Persistence.WrenchDbContext db) => _db = db;

    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public async Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default) =>
        await _db.Users.AsNoTracking().OrderByDescending(u => u.CreatedAt).ToListAsync(ct);

    public async Task AddAsync(User user, CancellationToken ct = default) =>
        await _db.Users.AddAsync(user, ct);

    public void Update(User user) => _db.Users.Update(user);
}

internal sealed class TenantRepository : Wrench.Domain.Tenancy.ITenantRepository
{
    private readonly Persistence.WrenchDbContext _db;

    public TenantRepository(Persistence.WrenchDbContext db) => _db = db;

    public Task<Wrench.Domain.Tenancy.Tenant?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Tenants.FirstOrDefaultAsync(t => t.Id == id, ct);

    public Task<Wrench.Domain.Tenancy.Tenant?> GetBySlugAsync(string slug, CancellationToken ct = default) =>
        _db.Tenants.FirstOrDefaultAsync(t => t.Slug == slug.ToLowerInvariant(), ct);

    public async Task AddAsync(Wrench.Domain.Tenancy.Tenant tenant, CancellationToken ct = default) =>
        await _db.Tenants.AddAsync(tenant, ct);
}
