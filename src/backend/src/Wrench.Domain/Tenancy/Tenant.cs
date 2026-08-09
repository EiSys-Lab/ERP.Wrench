using Wrench.Domain.Common;

namespace Wrench.Domain.Tenancy;

/// <summary>
/// Tenant raiz (empresa/oficina dona dos dados). Isolamento lógico.
/// Entidade admin-level (não passa pelo query filter).
/// </summary>
public sealed class Tenant : AggregateRoot
{
    public string RazaoSocial { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public string? Cnpj { get; private set; }
    public bool Ativo { get; private set; } = true;

    private Tenant() { }

    public static Tenant Criar(string razaoSocial, string slug, string? cnpj = null)
    {
        return new Tenant
        {
            Id = Guid.CreateVersion7(),
            RazaoSocial = razaoSocial.Trim(),
            Slug = slug.Trim().ToLowerInvariant(),
            Cnpj = cnpj,
            Ativo = true,
        };
    }
}

/// <summary>Repositório de Tenant (admin-level).</summary>
public interface ITenantRepository
{
    Task<Tenant?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Tenant?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task AddAsync(Tenant tenant, CancellationToken ct = default);
}
