using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Persistence;
using Wrench.Domain.Common;

namespace Wrench.Infrastructure.Persistence;

/// <summary>
/// Unit of Work — ponto único de SaveChanges.
/// Popula auditoria (CreatedAt/UpdatedAt), TenantId e dispara domain events.
/// </summary>
public sealed class UnitOfWork : IUnitOfWork
{
    private readonly WrenchDbContext _db;

    public UnitOfWork(WrenchDbContext db) => _db = db;

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in _db.ChangeTracker.Entries())
        {
            if (entry.Entity is not Entity entity) continue;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = now;
                entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = now;
            }
        }

        return await _db.SaveChangesAsync(ct);
    }
}
