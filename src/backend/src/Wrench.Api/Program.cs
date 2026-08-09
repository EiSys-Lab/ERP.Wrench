using FastEndpoints;
using FastEndpoints.Swagger;
using Serilog;
using Wrench.Application;
using Wrench.Infrastructure;

// ─── Serilog (estruturado, console + enrichers) ───
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .CreateLogger();

try
{
    Log.Information("Wrench API — iniciando...");

    var builder = WebApplication.CreateBuilder(args);

    // Porta fixa dev (5012). Em produção Railway injeta PORT automaticamente.
    var httpPort = Environment.GetEnvironmentVariable("PORT") ?? "5012";
    builder.WebHost.UseUrls($"http://+:{httpPort}");
    builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));

    // ─── DI ───
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddHealthChecks()
        .AddDbContextCheck<Wrench.Infrastructure.Persistence.WrenchDbContext>("postgres");

    builder.Services.AddFastEndpoints();
    builder.Services.SwaggerDocument(o =>
    {
        o.DocumentSettings = s =>
        {
            s.Title = "Wrench ERP-Oficina API";
            s.Version = "v1";
        };
    });

    // ─── CORS ───
    var allowedOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:3000")
        .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("FrontendOrigins", policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());
    });

    var app = builder.Build();

    // ─── Pipeline ───
    app.UseSerilogRequestLogging();
    app.UseCors("FrontendOrigins");
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseTenantResolution();
    app.UseFastEndpoints();

    // Health checks — /health (raso), /health/ready (profundo, checa Postgres)
    app.MapHealthChecks("/health");
    app.MapHealthChecks("/health/ready");

    if (app.Environment.IsDevelopment())
    {
        app.UseSwaggerGen();
    }

    app.MapGet("/", () => new { name = "Wrench ERP-Oficina API", version = "0.1.0" });

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Wrench API — encerrado por erro fatal.");
    throw;
}
finally
{
    Log.CloseAndFlush();
}

// Expõe Program para WebApplicationFactory nos testes de integração.
public partial class Program;
