using Wrench.Application.Common.Tenancy;

namespace Wrench.Infrastructure.Tenancy;

/// <summary>
/// Contexto do tenant ativo (Scoped). Populado pelo TenantResolutionMiddleware.
/// </summary>
public sealed class TenantContext : ITenantContext
{
    public Guid? TenantId { get; private set; }
    public Guid? StoreId { get; private set; }
    public Guid? UserId { get; private set; }

    public void SetContext(Guid? tenantId, Guid? storeId, Guid? userId)
    {
        TenantId = tenantId;
        StoreId = storeId;
        UserId = userId;
    }
}

/// <summary>
/// Contexto nulo — usado pelo DesignTimeDbContextFactory em dotnet ef.
/// Permite rodar migrations sem tenant resolvido.
/// </summary>
public sealed class NullTenantContext : ITenantContext
{
    public Guid? TenantId => Guid.Empty;
    public Guid? StoreId => null;
    public Guid? UserId => null;
    public void SetContext(Guid? tenantId, Guid? storeId, Guid? userId) { }
}
