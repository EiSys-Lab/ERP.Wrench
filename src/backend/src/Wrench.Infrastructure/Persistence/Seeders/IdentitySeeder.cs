using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Security;
using Wrench.Domain.Identity;
using Wrench.Domain.Tenancy;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeder de Identity (Order 2). Cria o usuário admin (admin@wrench.com.br /
/// Admin@123) vinculado ao tenant demo, se não existir.
/// </summary>
public sealed class IdentitySeeder : IDataSeeder
{
    private readonly IPasswordHasher _hasher;

    public IdentitySeeder(IPasswordHasher hasher) => _hasher = hasher;

    public int Order => 2;
    public string Name => "Identity (admin)";

    public async Task SeedAsync(Persistence.WrenchDbContext db, CancellationToken ct = default)
    {
        if (await db.Users.AnyAsync(u => u.Email == "admin@wrench.com.br", ct))
            return;

        // Resolve o tenant real criado pelo TenantSeeder (Order 1).
        var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == "fininho-auto-eletrica", ct);

        var hash = _hasher.Hash("Admin@123");
        var admin = User.Criar("FININHO (Admin)", "admin@wrench.com.br", hash);

        // Vincula o admin ao tenant demo (não passa pelo query filter,
        // então precisa setar manualmente).
        if (tenant is not null)
            admin.DefinirTenant(tenant.Id);

        await db.Users.AddAsync(admin, ct);
        await db.SaveChangesAsync(ct);
    }
}
