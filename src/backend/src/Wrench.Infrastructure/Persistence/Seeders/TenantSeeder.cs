using Microsoft.EntityFrameworkCore;
using Wrench.Domain.Tenancy;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeder de Tenant (Order 1 — roda primeiro). Cria o tenant demo
/// "FININHO Auto Elétrica" se não existir. Após rodar, o
/// DatabaseInitializerService resolve o tenantId e popula o ITenantContext.
/// </summary>
public sealed class TenantSeeder : IDataSeeder
{
    public int Order => 1;
    public string Name => "Tenant";

    public async Task SeedAsync(Persistence.WrenchDbContext db, CancellationToken ct = default)
    {
        if (await db.Tenants.AnyAsync(t => t.Slug == "fininho-auto-eletrica", ct))
            return;

        var tenant = Tenant.Criar(
            razaoSocial: "FININHO Auto Elétrica LTDA",
            slug: "fininho-auto-eletrica",
            cnpj: "12.345.678/0001-90");

        await db.Tenants.AddAsync(tenant, ct);
        await db.SaveChangesAsync(ct);
    }
}
