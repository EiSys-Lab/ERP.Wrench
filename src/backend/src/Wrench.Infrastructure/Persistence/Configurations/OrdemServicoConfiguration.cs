using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.OrdensServico;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuration de OrdemServico. Itens como OwnsMany (mesmo agregado).
/// Totais são computed (ignored — calculados em runtime).
/// </summary>
public sealed class OrdemServicoConfiguration : IEntityTypeConfiguration<OrdemServico>
{
    public void Configure(EntityTypeBuilder<OrdemServico> b)
    {
        b.ToTable("ordens_servico");
        b.HasKey(o => o.Id);

        // Numero IDENTITY ALWAYS no Postgres (protege contra UPDATE).
        b.Property(o => o.Numero)
            .UseIdentityAlwaysColumn();
        b.Property(o => o.Numero).Metadata.SetAfterSaveBehavior(Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore);

        b.Property(o => o.ClienteId).IsRequired();
        b.Property(o => o.ClienteNome).IsRequired().HasMaxLength(120);
        b.Property(o => o.VeiculoPlaca).IsRequired().HasMaxLength(10);
        b.Property(o => o.VeiculoModelo).IsRequired().HasMaxLength(80);
        b.Property(o => o.VeiculoMarca).HasMaxLength(60);
        b.Property(o => o.MecanicoNome).HasMaxLength(80);
        b.Property(o => o.Observacoes).HasMaxLength(500);

        // SmartEnums → int.
        b.Property(o => o.Status).HasConversion(s => s.Value, v => OsStatus.FromValue(v));
        b.Property(o => o.PagamentoStatus).HasConversion(s => s.Value, v => PagamentoStatus.FromValue(v));

        // Decimais.
        b.Property(o => o.Desconto).HasColumnType("numeric(18,2)");
        b.Property(o => o.TotalPago).HasColumnType("numeric(18,2)");

        // Timestamps.
        b.Property(o => o.DataEntrada).HasColumnType("timestamptz");
        b.Property(o => o.DataSaida).HasColumnType("timestamptz");

        // Computed (não persistem).
        b.Ignore(o => o.TotalPecas);
        b.Ignore(o => o.TotalMaoDeObra);
        b.Ignore(o => o.TotalGeral);
        b.Ignore(o => o.DomainEvents);

        // Índices.
        b.HasIndex(o => o.Numero).IsUnique();
        b.HasIndex(o => o.ClienteId).HasDatabaseName("ix_ordens_servico_cliente_id");
        b.HasIndex(o => o.Status).HasDatabaseName("ix_ordens_servico_status");

        // Itens como OwnsMany (entidade interna do agregado).
        b.OwnsMany(o => o.Itens, item =>
        {
            item.ToTable("ordem_servico_itens");
            item.WithOwner().HasForeignKey("OrdemServicoId");
            item.HasKey(i => i.Id);
            item.Property(i => i.Id).ValueGeneratedNever();

            item.Property(i => i.Tipo).HasConversion(t => t.Value, v => OsItemTipo.FromValue(v));
            item.Property(i => i.Nome).IsRequired().HasMaxLength(120);
            item.Property(i => i.Codigo).HasMaxLength(40);
            item.Property(i => i.Compartimento).HasMaxLength(60);
            item.Property(i => i.PrecoUnitario).HasColumnType("numeric(18,2)");
            item.Property(i => i.Subtotal).HasColumnType("numeric(18,2)");
            item.Property(i => i.MaoDeObra).HasColumnType("numeric(18,2)");
            item.Property(i => i.ValorFinal).HasColumnType("numeric(18,2)");

            item.Ignore(i => i.TenantId);
            item.Ignore(i => i.CreatedAt);
            item.Ignore(i => i.UpdatedAt);

            item.HasIndex("OrdemServicoId").HasDatabaseName("ix_os_itens_os_id");
        });

        // Acesso via backing field.
        b.Navigation(o => o.Itens).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
