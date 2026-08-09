using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Wrench.Application.Common.Tenancy;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Serviço hosted que roda na primeira subida da API:
/// 1. Aplica migrations pendentes (auto-migrate).
/// 2. Resolve o tenant demo e popula o ITenantContext (fail-closed).
/// 3. Executa os seeders em ordem (fail soft — loga erro e continua).
///
/// Config: Wrench:Database:AutoMigrate (default true), AutoSeed (default true
/// só em Development).
/// </summary>
public sealed class DatabaseInitializerService : IHostedService
{
    private readonly IServiceProvider _services;
    private readonly IConfiguration _config;
    private readonly ITenantContext _tenantContext;

    public DatabaseInitializerService(
        IServiceProvider services,
        IConfiguration config,
        ITenantContext tenantContext)
    {
        _services = services;
        _config = config;
        _tenantContext = tenantContext;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<WrenchDbContext>();

        var autoMigrate = _config.GetValue("Wrench:Database:AutoMigrate", true);
        var autoSeed = _config.GetValue("Wrench:Database:AutoSeed", true);

        // 1. Auto-migrate
        if (autoMigrate)
        {
            Log.Information("DatabaseInitializer: aplicando migrations...");
            await db.Database.MigrateAsync(cancellationToken);
        }

        if (!autoSeed) return;

        // 2. Modo legacy para o TenantSeeder enxergar (fail-closed query filter).
        _tenantContext.SetContext(Guid.Empty, null, null);

        // 3. Seeders
        var seeders = scope.ServiceProvider
            .GetServices<IDataSeeder>()
            .OrderBy(s => s.Order)
            .ToList();

        Log.Information("DatabaseInitializer: executando {Count} seeders...", seeders.Count);

        foreach (var seeder in seeders)
        {
            try
            {
                // Após o TenantSeeder (Order 1), resolve o tenant real e
                // popula o contexto para os seeders seguintes passarem pelo filtro.
                if (seeder.Order == 1)
                {
                    await seeder.SeedAsync(db, cancellationToken);
                    var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == "fininho-auto-eletrica", cancellationToken);
                    if (tenant is not null)
                    {
                        _tenantContext.SetContext(tenant.Id, null, null);
                        Log.Information("DatabaseInitializer: tenant resolvido {TenantId}", tenant.Id);
                    }
                    continue;
                }

                await seeder.SeedAsync(db, cancellationToken);
                Log.Information("DatabaseInitializer: {Name} OK", seeder.Name);
            }
            catch (Exception ex)
            {
                // Fail soft: loga e continua (não trava a subida da API).
                Log.Error(ex, "DatabaseInitializer: ERRO no seeder {Name}", seeder.Name);
            }
        }

        Log.Information("DatabaseInitializer: concluído.");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
