using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wrench.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "logs_auditoria",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    Acao = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Entidade = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    EntidadeId = table.Column<Guid>(type: "uuid", nullable: true),
                    Endpoint = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Detalhes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IpOrigem = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    DataHora = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_logs_auditoria", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_logs_auditoria_data",
                schema: "wrench",
                table: "logs_auditoria",
                column: "DataHora");

            migrationBuilder.CreateIndex(
                name: "ix_logs_auditoria_tenant",
                schema: "wrench",
                table: "logs_auditoria",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "logs_auditoria",
                schema: "wrench");
        }
    }
}
