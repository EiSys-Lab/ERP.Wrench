using Wrench.Infrastructure.Persistence;

namespace Wrench.Infrastructure.Persistence.Seeders;

/// <summary>
/// Contrato de seeder idempotente. Cada implementação popula um agregado.
/// A ordem é controlada por <see cref="Order"/> (menor roda primeiro).
/// </summary>
public interface IDataSeeder
{
    /// <summary>Ordem de execução (1 = primeiro).</summary>
    int Order { get; }

    /// <summary>Nome legível (para logs).</summary>
    string Name { get; }

    /// <summary>Popula dados se ainda não existirem (idempotente).</summary>
    Task SeedAsync(WrenchDbContext db, CancellationToken ct = default);
}
