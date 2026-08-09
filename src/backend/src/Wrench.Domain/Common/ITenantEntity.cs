namespace Wrench.Domain.Common;

/// <summary>
/// Marca entidades que pertencem a um tenant (isolamento multi-tenant).
/// O DbContext aplica query filter automático por TenantId.
/// </summary>
public interface ITenantEntity
{
    Guid TenantId { get; }
}
