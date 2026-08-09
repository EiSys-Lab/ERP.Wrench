namespace Wrench.Domain.Common;

/// <summary>
/// Base de toda entidade do domínio — identidade por Id (Guid v7 para
/// ordering temporal natural). Igualdade comparada por Id, NÃO por valor.
///
/// Inclui <see cref="TenantId"/> para isolamento multi-tenant. Entidades
/// que pertencem a um tenant implementam <see cref="ITenantEntity"/>
/// implicitamente via herança. O DbContext aplica query filter automático.
///
/// Campos de auditoria (CreatedAt/UpdatedAt em UTC).
/// </summary>
public abstract class Entity : IEquatable<Entity>, ITenantEntity
{
    public Guid Id { get; protected set; }

    /// <summary>
    /// Tenant dono desta entidade. Populado automaticamente pelo UnitOfWork
    /// a partir do ITenantContext ativo no momento do SaveChanges.
    /// </summary>
    public Guid TenantId { get; set; }

    /// <summary>Momento de criação em UTC.</summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>Última atualização em UTC.</summary>
    public DateTimeOffset UpdatedAt { get; set; }

    protected Entity()
    {
        Id = Guid.CreateVersion7();
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    protected Entity(Guid id)
    {
        Id = id;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool Equals(Entity? other) => other is not null && Id == other.Id;
    public override bool Equals(object? obj) => obj is Entity e && Equals(e);
    public override int GetHashCode() => Id.GetHashCode();

    public static bool operator ==(Entity? a, Entity? b) => Equals(a, b);
    public static bool operator !=(Entity? a, Entity? b) => !Equals(a, b);
}
