using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.Clientes;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>Configuration de Cliente. Veiculos como OwnsMany.</summary>
public sealed class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> b)
    {
        b.ToTable("clientes");
        b.HasKey(c => c.Id);

        b.Property(c => c.Nome).IsRequired().HasMaxLength(120);
        b.Property(c => c.Tipo).HasConversion(t => t.Value, v => ClienteTipo.FromValue(v));
        b.Property(c => c.Documento).HasMaxLength(20);
        b.Property(c => c.Telefone).HasMaxLength(20);
        b.Property(c => c.Email).HasMaxLength(200);
        b.Property(c => c.Endereco).HasMaxLength(300);
        b.Property(c => c.Ativo).HasDefaultValue(true);

        b.Ignore(c => c.DomainEvents);

        b.HasIndex(c => c.Documento).HasDatabaseName("ix_clientes_documento");

        // Veículos como OwnsMany (entidade filha do agregado).
        b.OwnsMany(c => c.Veiculos, v =>
        {
            v.ToTable("veiculos");
            v.WithOwner().HasForeignKey(ve => ve.ClienteId);
            v.HasKey(ve => ve.Id);
            v.Property(ve => ve.Id).ValueGeneratedNever();

            v.Property(ve => ve.Placa).IsRequired().HasMaxLength(10);
            v.Property(ve => ve.Modelo).IsRequired().HasMaxLength(80);
            v.Property(ve => ve.Marca).HasMaxLength(60);
            v.Property(ve => ve.Cor).HasMaxLength(30);

            v.Ignore(ve => ve.TenantId);
            v.Ignore(ve => ve.CreatedAt);
            v.Ignore(ve => ve.UpdatedAt);

            v.HasIndex(ve => ve.Placa).HasDatabaseName("ix_veiculos_placa");
        });

        b.Navigation(c => c.Veiculos).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
