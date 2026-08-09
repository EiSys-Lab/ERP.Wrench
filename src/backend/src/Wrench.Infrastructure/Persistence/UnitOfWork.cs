using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Persistence;
using Wrench.Application.Common.Tenancy;
using Wrench.Domain.Common;

namespace Wrench.Infrastructure.Persistence;

/// <summary>
/// Unit of Work — ponto único de SaveChanges.
/// Popula auditoria (CreatedAt/UpdatedAt), TenantId (de ITenantContext) e dispara domain events.
/// </summary>
public sealed class UnitOfWork : IUnitOfWork
{
    private readonly WrenchDbContext _db;
    private readonly ITenantContext _tenantContext;

    public UnitOfWork(WrenchDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var now = DateTimeOffset.UtcNow;
        var tenantId = _tenantContext.TenantId;

        foreach (var entry in _db.ChangeTracker.Entries())
        {
            if (entry.Entity is not Entity entity) continue;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = now;
                entity.UpdatedAt = now;
                // Popula TenantId se resolvido no contexto e entidade for tenant-scoped.
                if (tenantId is not null && tenantId != Guid.Empty && entity.TenantId == Guid.Empty)
                    entity.TenantId = tenantId.Value;
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = now;
            }
        }

        return await _db.SaveChangesAsync(ct);
    }
}
