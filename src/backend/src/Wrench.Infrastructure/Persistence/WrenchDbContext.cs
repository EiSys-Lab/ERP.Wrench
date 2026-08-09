using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Tenancy;
using Wrench.Domain.Auditoria;
using Wrench.Domain.Catalogo;
using Wrench.Domain.Clientes;
using Wrench.Domain.Common;
using Wrench.Domain.Estoque;
using Wrench.Domain.Identity;
using Wrench.Domain.OrdensServico;
using Wrench.Domain.Tenancy;

namespace Wrench.Infrastructure.Persistence;

/// <summary>
/// DbContext principal do Wrench.
/// - Schema default: wrench
/// - Query filter fail-closed por TenantId (entidades que implementam
///   ITenantEntity só aparecem se TenantId do contexto estiver resolvido).
/// - Entidades admin-level (Tenant, User, Role, Permission) NÃO filtram.
/// </summary>
public sealed class WrenchDbContext : DbContext
{
    private readonly ITenantContext _tenantContext;

    public WrenchDbContext(DbContextOptions<WrenchDbContext> options, ITenantContext tenantContext)
        : base(options)
    {
        _tenantContext = tenantContext;
    }

    // Identity (admin-level, sem query filter)
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();

    // Tenancy (admin-level)
    public DbSet<Tenant> Tenants => Set<Tenant>();

    // Negócio (tenant-scoped via query filter)
    public DbSet<OrdemServico> OrdensServico => Set<OrdemServico>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Peca> Pecas => Set<Peca>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<CategoriaPeca> CategoriasPeca => Set<CategoriaPeca>();
    public DbSet<MovimentoEstoque> MovimentosEstoque => Set<MovimentoEstoque>();

    // Auditoria (admin-level, sem query filter)
    public DbSet<LogAuditoria> LogsAuditoria => Set<LogAuditoria>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("wrench");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WrenchDbContext).Assembly);

        ApplyTenantQueryFilter(modelBuilder);
    }

    /// <summary>
    /// Override de SaveChangesAsync para popular auditoria (CreatedAt/UpdatedAt)
    /// e TenantId em entidades Added (garante que seeders também populam tenant).
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var tenantId = _tenantContext.TenantId;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is not Entity entity) continue;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = now;
                entity.UpdatedAt = now;
                if (tenantId is not null && tenantId != Guid.Empty && entity.TenantId == Guid.Empty)
                    entity.TenantId = tenantId.Value;
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = now;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Aplica query filter fail-closed em entidades que implementam ITenantEntity
    /// (exceto admin-level). Quando TenantId é null, nenhuma linha retorna.
    /// </summary>
    private void ApplyTenantQueryFilter(ModelBuilder modelBuilder)
    {
        // Tipos admin-level que NÃO recebem query filter.
        var adminTypes = new HashSet<string>
        {
            nameof(Tenant),
            nameof(User),
            nameof(Role),
            nameof(Permission),
        };

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            // Pula owned types e subtipos TPH/TPC.
            if (entityType.IsOwned() || entityType.BaseType is not null) continue;
            if (adminTypes.Contains(entityType.ClrType.Name)) continue;

            // Só filtra tipos que implementam ITenantEntity.
            if (!typeof(ITenantEntity).IsAssignableFrom(entityType.ClrType)) continue;

            // Expressão: (Guid?)e.TenantId == ctx.TenantId
            // Importante: capturamos a REFERÊNCIA ao _tenantContext (não o valor),
            // para que o filtro seja reavaliado a cada query (o modelo é cacheado).
            var param = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
            var prop = System.Linq.Expressions.Expression.Property(param, nameof(ITenantEntity.TenantId));
            var propNullable = System.Linq.Expressions.Expression.Convert(prop, typeof(Guid?));
            var ctxTenantId = System.Linq.Expressions.Expression.Property(
                System.Linq.Expressions.Expression.Constant(_tenantContext),
                nameof(ITenantContext.TenantId));
            var equal = System.Linq.Expressions.Expression.Equal(propNullable, ctxTenantId);
            var lambda = System.Linq.Expressions.Expression.Lambda(equal, param);

            entityType.SetQueryFilter(lambda);
        }
    }
}
