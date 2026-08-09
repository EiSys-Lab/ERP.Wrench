namespace Wrench.Application.Common.Tenancy;

/// <summary>
/// Contexto do tenant ativo na requisição. Populado pelo
/// TenantResolutionMiddleware (lê claim JWT tenant_id ou header X-Tenant-Id).
/// </summary>
public interface ITenantContext
{
    Guid? TenantId { get; }
    Guid? StoreId { get; }
    Guid? UserId { get; }
    void SetContext(Guid? tenantId, Guid? storeId, Guid? userId);
}

/// <summary>Usuário atual logado (para auditoria e UI).</summary>
public interface ICurrentUser
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Nome { get; }
}
