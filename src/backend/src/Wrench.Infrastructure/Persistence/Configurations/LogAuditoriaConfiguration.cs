using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Wrench.Domain.Auditoria;

namespace Wrench.Infrastructure.Persistence.Configurations;

/// <summary>Configuration de LogAuditoria. Tabela de append-only (auditoria).</summary>
public sealed class LogAuditoriaConfiguration : IEntityTypeConfiguration<LogAuditoria>
{
    public void Configure(EntityTypeBuilder<LogAuditoria> b)
    {
        b.ToTable("logs_auditoria");
        b.HasKey(l => l.Id);

        b.Property(l => l.UserId);
        b.Property(l => l.TenantIdAudit).HasColumnName("TenantId");
        b.Property(l => l.Acao).IsRequired().HasMaxLength(40);
        b.Property(l => l.Entidade).IsRequired().HasMaxLength(60);
        b.Property(l => l.EntidadeId);
        b.Property(l => l.Endpoint).HasMaxLength(200);
        b.Property(l => l.Detalhes).HasMaxLength(500);
        b.Property(l => l.IpOrigem).HasMaxLength(45);
        b.Property(l => l.DataHora).HasColumnType("timestamptz");

        // Auditoria NÃO tem query filter de tenant (admin pode ver tudo).
        // Mas tem índice por tenant para consulta filtrada.
        b.HasIndex(l => l.TenantIdAudit).HasDatabaseName("ix_logs_auditoria_tenant");
        b.HasIndex(l => l.DataHora).HasDatabaseName("ix_logs_auditoria_data");

        b.Ignore(l => l.TenantId); // Usa TenantIdAudit mapeado
    }
}
