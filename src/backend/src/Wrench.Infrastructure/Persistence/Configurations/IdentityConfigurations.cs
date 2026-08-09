using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.Identity;
using Wrench.Domain.Tenancy;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>Configurações de Identity (User, Role, Permission) e Tenant.</summary>
public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> b)
    {
        b.ToTable("users");
        b.HasKey(u => u.Id);

        b.Property(u => u.Nome).IsRequired().HasMaxLength(120);
        b.Property(u => u.Email).IsRequired().HasMaxLength(200);
        b.HasIndex(u => u.Email).IsUnique();
        b.Property(u => u.PasswordHash).IsRequired();
        b.Property(u => u.Ativo).HasDefaultValue(true);

        b.HasMany(u => u.Roles)
         .WithMany()
         .UsingEntity("user_roles");

        // TenantId persiste (para saber a qual tenant o usuário pertence),
        // mas users NÃO passam pelo query filter (admin-level).
        b.Property(u => u.TenantId).HasDefaultValue(Guid.Empty);
    }
}

public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> b)
    {
        b.ToTable("roles");
        b.HasKey(r => r.Id);
        b.Property(r => r.Nome).IsRequired().HasMaxLength(80);
        b.Property(r => r.Descricao).HasMaxLength(200);

        b.HasMany(r => r.Permissoes)
         .WithMany()
         .UsingEntity("role_permissions");

        b.Ignore(r => r.TenantId);
    }
}

public sealed class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> b)
    {
        b.ToTable("permissions");
        b.HasKey(p => p.Id);
        b.Property(p => p.Modulo).IsRequired().HasMaxLength(80);

        b.Ignore(p => p.TenantId);
    }
}

public sealed class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> b)
    {
        b.ToTable("tenants");
        b.HasKey(t => t.Id);
        b.Property(t => t.RazaoSocial).IsRequired().HasMaxLength(200);
        b.Property(t => t.Slug).IsRequired().HasMaxLength(80);
        b.HasIndex(t => t.Slug).IsUnique();
        b.Property(t => t.Cnpj).HasMaxLength(18);
        b.Property(t => t.Ativo).HasDefaultValue(true);

        b.Ignore(t => t.DomainEvents);
    }
}
