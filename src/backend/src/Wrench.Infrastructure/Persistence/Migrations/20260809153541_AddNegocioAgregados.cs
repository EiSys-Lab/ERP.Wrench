using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Wrench.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddNegocioAgregados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias_peca",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias_peca", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clientes",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Documento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Endereco = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "movimentos_estoque",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PecaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PecaCodigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    PecaNome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Quantidade = table.Column<int>(type: "integer", nullable: false),
                    SaldoAnterior = table.Column<int>(type: "integer", nullable: false),
                    SaldoResultante = table.Column<int>(type: "integer", nullable: false),
                    DocumentoOrigem = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Motivo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    OperadorNome = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    DataMovimento = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movimentos_estoque", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ordens_servico",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Numero = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    ClienteId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClienteNome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    VeiculoPlaca = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    VeiculoModelo = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    VeiculoMarca = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    MecanicoNome = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Desconto = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    TotalPago = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PagamentoStatus = table.Column<int>(type: "integer", nullable: false),
                    DataEntrada = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    DataSaida = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ordens_servico", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "pecas",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Nome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    CategoriaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Compartimento = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Unidade = table.Column<int>(type: "integer", nullable: false),
                    Preco = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Custo = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    QuantidadeEstoque = table.Column<int>(type: "integer", nullable: false),
                    EstoqueMinimo = table.Column<int>(type: "integer", nullable: false),
                    EstoqueMaximo = table.Column<int>(type: "integer", nullable: true),
                    CodigoBarras = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Ncm = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pecas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "servicos",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Codigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Nome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Categoria = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    ValorBase = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    TempoEstimadoMin = table.Column<int>(type: "integer", nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_servicos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "veiculos",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Placa = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Modelo = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Marca = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    Ano = table.Column<int>(type: "integer", nullable: true),
                    Cor = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_veiculos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_veiculos_clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalSchema: "wrench",
                        principalTable: "clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ordem_servico_itens",
                schema: "wrench",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrdemServicoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    PecaId = table.Column<Guid>(type: "uuid", nullable: true),
                    ServicoId = table.Column<Guid>(type: "uuid", nullable: true),
                    Nome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Compartimento = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    Quantidade = table.Column<int>(type: "integer", nullable: false),
                    PrecoUnitario = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    MaoDeObra = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ValorFinal = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ordem_servico_itens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ordem_servico_itens_ordens_servico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalSchema: "wrench",
                        principalTable: "ordens_servico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_clientes_documento",
                schema: "wrench",
                table: "clientes",
                column: "Documento");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_data",
                schema: "wrench",
                table: "movimentos_estoque",
                column: "DataMovimento");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_peca_id",
                schema: "wrench",
                table: "movimentos_estoque",
                column: "PecaId");

            migrationBuilder.CreateIndex(
                name: "ix_os_itens_os_id",
                schema: "wrench",
                table: "ordem_servico_itens",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "ix_ordens_servico_cliente_id",
                schema: "wrench",
                table: "ordens_servico",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_ordens_servico_Numero",
                schema: "wrench",
                table: "ordens_servico",
                column: "Numero",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_ordens_servico_status",
                schema: "wrench",
                table: "ordens_servico",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_pecas_Codigo",
                schema: "wrench",
                table: "pecas",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_pecas_codigo_barras",
                schema: "wrench",
                table: "pecas",
                column: "CodigoBarras");

            migrationBuilder.CreateIndex(
                name: "IX_servicos_Codigo",
                schema: "wrench",
                table: "servicos",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_veiculos_ClienteId",
                schema: "wrench",
                table: "veiculos",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "ix_veiculos_placa",
                schema: "wrench",
                table: "veiculos",
                column: "Placa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "categorias_peca",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "movimentos_estoque",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "ordem_servico_itens",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "pecas",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "servicos",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "veiculos",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "ordens_servico",
                schema: "wrench");

            migrationBuilder.DropTable(
                name: "clientes",
                schema: "wrench");
        }
    }
}
