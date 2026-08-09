using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.Estoque;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>Configuration de MovimentoEstoque (trilha imutável).</summary>
public sealed class MovimentoEstoqueConfiguration : IEntityTypeConfiguration<MovimentoEstoque>
{
    public void Configure(EntityTypeBuilder<MovimentoEstoque> b)
    {
        b.ToTable("movimentos_estoque");
        b.HasKey(m => m.Id);

        b.Property(m => m.PecaId).IsRequired();
        b.Property(m => m.PecaCodigo).IsRequired().HasMaxLength(40);
        b.Property(m => m.PecaNome).IsRequired().HasMaxLength(120);
        b.Property(m => m.Tipo).HasConversion(t => t.Value, v => TipoMovimento.FromValue(v));
        b.Property(m => m.DocumentoOrigem).HasMaxLength(40);
        b.Property(m => m.Motivo).HasMaxLength(200);
        b.Property(m => m.OperadorNome).HasMaxLength(80);
        b.Property(m => m.DataMovimento).HasColumnType("timestamptz");

        b.Ignore(m => m.DomainEvents);

        b.HasIndex(m => m.PecaId).HasDatabaseName("ix_movimentos_peca_id");
        b.HasIndex(m => m.DataMovimento).HasDatabaseName("ix_movimentos_data");
    }
}
