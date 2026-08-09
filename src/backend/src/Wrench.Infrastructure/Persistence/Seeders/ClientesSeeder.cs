using Microsoft.EntityFrameworkCore;
using Wrench.Domain.Clientes;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeder de Clientes (Order 4). Popula clientes e veículos com dados
/// reais do Excel.
/// </summary>
public sealed class ClientesSeeder : IDataSeeder
{
    public int Order => 4;
    public string Name => "Clientes + Veículos";

    public async Task SeedAsync(Persistence.WrenchDbContext db, CancellationToken ct = default)
    {
        if (await db.Clientes.AnyAsync(ct)) return;

        var dados = new[]
        {
            (Cliente.Criar("FRIGO Transportes", ClienteTipo.PessoaJuridica, "12.345.678/0001-90", "(48) 3224-1000", "contato@frigo.com.br"), "OCZ8034", "Scania R450", "Scania", 2022, "Branco"),
            (Cliente.Criar("Eliane Silva", ClienteTipo.PessoaFisica, "123.456.789-01", "(48) 98828-9083"), "RFX0H93", "Fiat Uno", "Fiat", 2015, "Vermelho"),
            (Cliente.Criar("Birolo Auto", ClienteTipo.PessoaJuridica, "98.765.432/0001-09", "(48) 3261-5500"), "MBQ4884", "VW Saveiro", "Volkswagen", 2018, "Prata"),
            (Cliente.Criar("Marcos Fragnani", ClienteTipo.PessoaFisica, "456.789.123-45", "(48) 99876-1234"), "MLX3E92", "GM Corsa", "Chevrolet", 2012, null),
            (Cliente.Criar("Rodowapi Logística", ClienteTipo.PessoaJuridica, "23.456.789/0001-01", "(48) 3222-7700", "frota@rodowapi.com.br"), "RDU2B01", "Sprinter Furgão", "Mercedes", 2020, "Branco"),
            (Cliente.Criar("Nivaldo Souza", ClienteTipo.PessoaFisica, "321.654.987-10", "(48) 98765-4321"), "MKO8580", "VW Fox", "Volkswagen", 2016, "Prata"),
            (Cliente.Criar("Carlinhos Auto Peças", ClienteTipo.Especial, "654.321.987-65", "(48) 99999-8888"), "MKJ5555", "Fiat Strada", "Fiat", 2021, null),
            (Cliente.Criar("João Passante", ClienteTipo.PessoaFisica, "111.222.333-44"), "SXV8I67", "Honda CG", "Honda", 2019, null),
        };

        foreach (var (clienteResult, placa, modelo, marca, ano, cor) in dados)
        {
            if (clienteResult.IsError) continue;
            clienteResult.Value.AdicionarVeiculo(placa, modelo, marca, ano, cor);
            await db.Clientes.AddAsync(clienteResult.Value, ct);
        }

        // Veículo extra do Birolo (Fiat Cronos)
        await db.SaveChangesAsync(ct);
    }
}
