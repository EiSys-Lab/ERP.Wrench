using Microsoft.EntityFrameworkCore;
using Wrench.Domain.Catalogo;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeder de Catálogo (Order 3). Popula peças e serviços (M.O) com dados
/// reais do Excel "CONTROLE SAIDA DE PEÇAS FININHO".
/// </summary>
public sealed class CatalogoSeeder : IDataSeeder
{
    public int Order => 3;
    public string Name => "Catálogo (peças + serviços)";

    public async Task SeedAsync(Persistence.WrenchDbContext db, CancellationToken ct = default)
    {
        // ── Peças ──
        if (!await db.Pecas.AnyAsync(ct))
        {
            var pecas = new[]
            {
                Peca.Criar("H4-12", "Lâmpada H4 12V", "Balcão", 30, estoqueMinimo: 10, custo: 18, quantidadeEstoque: 9, codigoBarras: "7891000010019", ncm: "8539.29.90"),
                Peca.Criar("H1-24", "Lâmpada H1 24V", "Balcão", 40, estoqueMinimo: 8, custo: 25, quantidadeEstoque: 6),
                Peca.Criar("HB4-12", "Lâmpada HB4 12V", "Balcão", 28, estoqueMinimo: 6, custo: 16, quantidadeEstoque: 4),
                Peca.Criar("H7", "Lâmpada H7 12V", "Balcão", 32, estoqueMinimo: 8, custo: 19, quantidadeEstoque: 14),
                Peca.Criar("PING-24", "Pingão 24V", "Gaveta 1", 10, estoqueMinimo: 15, custo: 5, quantidadeEstoque: 22),
                Peca.Criar("PING-12", "Pingão 12V", "Gaveta 1", 22, estoqueMinimo: 12, custo: 12, quantidadeEstoque: 18),
                Peca.Criar("SOQ-FAR", "Soquete farol", "Gaveta 2", 15, estoqueMinimo: 10, custo: 7, quantidadeEstoque: 11),
                Peca.Criar("SOQ-2P", "Soquete 2 polos", "Gaveta 2", 29, estoqueMinimo: 10, custo: 15, quantidadeEstoque: 7),
                Peca.Criar("C5V", "Conector 5 vias", "Gaveta 3", 26, estoqueMinimo: 10, custo: 14, quantidadeEstoque: 15),
                Peca.Criar("SIN-TRAS", "Sinaleira traseira", "Balcão", 160, estoqueMinimo: 4, custo: 95, quantidadeEstoque: 3),
                Peca.Criar("SIR-RE", "Sirene de ré", "Balcão", 40, estoqueMinimo: 6, custo: 22, quantidadeEstoque: 5),
                Peca.Criar("TER-BAT", "Terminal de bateria", "Gaveta 5", 18, estoqueMinimo: 15, custo: 9, quantidadeEstoque: 20, unidade: UnidadeMedida.Par),
                Peca.Criar("CAB-2X1", "Cabo 2x1", "Balcão", 14, estoqueMinimo: 20, custo: 8, quantidadeEstoque: 30, unidade: UnidadeMedida.Metro),
                Peca.Criar("FITA-TC", "Fita tecido isolante", "Balcão", 8, estoqueMinimo: 10, custo: 4, quantidadeEstoque: 0),
                Peca.Criar("EMB", "Embuchamento", "Gaveta 4", 12, estoqueMinimo: 15, custo: 6, quantidadeEstoque: 25),
                Peca.Criar("ABRAC", "Abraçadeiras", "Gaveta 4", 5, estoqueMinimo: 30, custo: 2, quantidadeEstoque: 50),
            };

            foreach (var p in pecas)
            {
                if (p.IsError) continue;
                await db.Pecas.AddAsync(p.Value, ct);
            }
            await db.SaveChangesAsync(ct);
        }

        // ── Serviços (M.O) ──
        if (!await db.Servicos.AnyAsync(ct))
        {
            var servicos = new[]
            {
                Servico.Criar("MO-001", "Socorro — básico", "Socorro", 60, tempoEstimadoMin: 60),
                Servico.Criar("MO-002", "Socorro — chicote completo", "Socorro", 280, tempoEstimadoMin: 240),
                Servico.Criar("MO-003", "Oficina + socorro", "Oficina", 800, tempoEstimadoMin: 480),
                Servico.Criar("MO-004", "Instalação simples", "Instalação", 20, tempoEstimadoMin: 20),
                Servico.Criar("MO-005", "Troca de lâmpadas", "Instalação", 30, tempoEstimadoMin: 30),
                Servico.Criar("MO-006", "Troca + ajuste de farol", "Instalação", 180, tempoEstimadoMin: 90),
                Servico.Criar("MO-007", "Serviço de pátio", "Oficina", 80, tempoEstimadoMin: 60),
                Servico.Criar("MO-008", "Diagnóstico elétrico", "Diagnóstico", 50, tempoEstimadoMin: 45),
            };

            foreach (var s in servicos)
            {
                if (s.IsError) continue;
                await db.Servicos.AddAsync(s.Value, ct);
            }
            await db.SaveChangesAsync(ct);
        }
    }
}
