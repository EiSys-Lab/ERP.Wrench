using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Wrench.Application.Common.Persistence;
using Wrench.Application.Common.Security;
using Wrench.Application.Common.Tenancy;
using Wrench.Domain.Identity;
using Wrench.Domain.Tenancy;
using Wrench.Infrastructure.Identity;
using Wrench.Infrastructure.Persistence;
using Wrench.Infrastructure.Persistence.Repositories;
using Wrench.Infrastructure.Tenancy;

namespace Wrench.Infrastructure;

/// <summary>
/// Registro da camada Infrastructure: DbContext, UnitOfWork, repos,
/// JWT (HS256), BCrypt, TenantContext e TenantResolutionMiddleware.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // DbContext
        services.AddDbContext<WrenchDbContext>(options =>
            options.UseNpgsql(
                ResolveConnectionString(config),
                npg => npg.MigrationsHistoryTable("__migrations", "wrench")));

        // Multi-tenant
        services.AddScoped<ITenantContext, TenantContext>();

        // UnitOfWork + repos
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITenantRepository, TenantRepository>();

        // Identity / Auth
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.Configure<JwtOptions>(config.GetSection("Jwt"));
        services.AddJwtAuthentication(config);

        return services;
    }

    /// <summary>Registra autenticação JWTBearer com validação HS256.</summary>
    private static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var jwtSection = config.GetSection("Jwt");
        var secret = jwtSection["Secret"] ?? string.Empty;

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSection["Issuer"] ?? "wrench-oficina",
                    ValidAudience = jwtSection["Audience"] ?? "wrench-oficina",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                    ClockSkew = TimeSpan.FromMinutes(1),
                    NameClaimType = "name",
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role,
                };
            });

        services.AddAuthorization();
        return services;
    }

    /// <summary>Registra o middleware de resolução de tenant.</summary>
    public static IApplicationBuilder UseTenantResolution(this IApplicationBuilder app)
    {
        app.UseMiddleware<TenantResolutionMiddleware>();
        return app;
    }

    /// <summary>Resolve connection string (DATABASE_URL Railway ou ConnectionStrings).</summary>
    private static string ResolveConnectionString(IConfiguration config)
    {
        var databaseUrl = config["DATABASE_URL"] ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrWhiteSpace(databaseUrl))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':', 2);
            var user = userInfo[0];
            var pass = userInfo.Length > 1 ? userInfo[1] : "";
            return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={user};Password={pass};SSL Mode=Require;Trust Server Certificate=true";
        }

        return config.GetConnectionString("Postgres")
            ?? "Host=localhost;Port=5434;Database=wrench_oficina;Username=wrench;Password=wrench";
    }
}
