using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Wrench.Infrastructure.Tenancy;

namespace Wrench.Infrastructure.Persistence;

/// <summary>
/// Factory para dotnet ef (migrations). Usa NullTenantContext (sem filtro).
/// Lê connection string de DATABASE_URL (formato Railway) ou ConnectionStrings.
/// </summary>
public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<WrenchDbContext>
{
    public WrenchDbContext CreateDbContext(string[] args)
    {
        var connectionString = ResolveConnectionString();

        var options = new DbContextOptionsBuilder<WrenchDbContext>()
            .UseNpgsql(connectionString, npg =>
                npg.MigrationsHistoryTable("__migrations", "wrench"))
            .Options;

        return new WrenchDbContext(options, new NullTenantContext());
    }

    private static string ResolveConnectionString()
    {
        // DATABASE_URL formato Railway/Heroku: postgres://user:pass@host:port/db
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrWhiteSpace(databaseUrl))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':', 2);
            var user = userInfo[0];
            var pass = userInfo.Length > 1 ? userInfo[1] : "";
            return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={user};Password={pass};SSL Mode=Require;Trust Server Certificate=true";
        }

        // Fallback padrão dev
        return Environment.GetEnvironmentVariable("ConnectionStrings__Postgres")
            ?? "Host=localhost;Port=5434;Database=wrench_oficina;Username=wrench;Password=wrench";
    }
}
