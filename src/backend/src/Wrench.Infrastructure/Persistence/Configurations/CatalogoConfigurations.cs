using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.Catalogo;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>Configurations de catálogo (Peca, Servico, CategoriaPeca).</summary>
public sealed class PecaConfiguration : IEntityTypeConfiguration<Peca>
{
    public void Configure(EntityTypeBuilder<Peca> b)
    {
        b.ToTable("pecas");
        b.HasKey(p => p.Id);

        b.Property(p => p.Codigo).IsRequired().HasMaxLength(40);
        b.Property(p => p.Nome).IsRequired().HasMaxLength(120);
        b.Property(p => p.Descricao).HasMaxLength(300);
        b.Property(p => p.Compartimento).IsRequired().HasMaxLength(60);
        b.Property(p => p.Unidade).HasConversion(u => u.Value, v => UnidadeMedida.FromValue(v));
        b.Property(p => p.Preco).HasColumnType("numeric(18,2)");
        b.Property(p => p.Custo).HasColumnType("numeric(18,2)");
        b.Property(p => p.CodigoBarras).HasMaxLength(20);
        b.Property(p => p.Ncm).HasMaxLength(10);
        b.Property(p => p.Ativo).HasDefaultValue(true);

        // Computed (não persistem).
        b.Ignore(p => p.Margem);
        b.Ignore(p => p.AbaixoDoMinimo);
        b.Ignore(p => p.DomainEvents);

        b.HasIndex(p => p.Codigo).IsUnique();
        b.HasIndex(p => p.CodigoBarras).HasDatabaseName("ix_pecas_codigo_barras");
    }
}

public sealed class ServicoConfiguration : IEntityTypeConfiguration<Servico>
{
    public void Configure(EntityTypeBuilder<Servico> b)
    {
        b.ToTable("servicos");
        b.HasKey(s => s.Id);

        b.Property(s => s.Codigo).IsRequired().HasMaxLength(40);
        b.Property(s => s.Nome).IsRequired().HasMaxLength(120);
        b.Property(s => s.Descricao).HasMaxLength(300);
        b.Property(s => s.Categoria).IsRequired().HasMaxLength(60);
        b.Property(s => s.ValorBase).HasColumnType("numeric(18,2)");
        b.Property(s => s.Ativo).HasDefaultValue(true);

        b.Ignore(s => s.DomainEvents);

        b.HasIndex(s => s.Codigo).IsUnique();
    }
}

public sealed class CategoriaPecaConfiguration : IEntityTypeConfiguration<CategoriaPeca>
{
    public void Configure(EntityTypeBuilder<CategoriaPeca> b)
    {
        b.ToTable("categorias_peca");
        b.HasKey(c => c.Id);

        b.Property(c => c.Nome).IsRequired().HasMaxLength(80);
        b.Property(c => c.Descricao).HasMaxLength(200);
        b.Property(c => c.Ativo).HasDefaultValue(true);

        b.Ignore(c => c.DomainEvents);
    }
}
