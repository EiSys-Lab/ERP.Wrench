using Wrench.Domain.Common;

namespace Wrench.Domain.Identity;

/// <summary>
/// Usuário do sistema (login). Hash de senha via BCrypt.
/// Entidade admin-level (não passa pelo query filter de tenant).
/// </summary>
public sealed class User : Entity
{
    public string Nome { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;
    public bool Ativo { get; private set; } = true;
    public DateTimeOffset? UltimoAcesso { get; private set; }

    private readonly List<Role> _roles = [];
    public IReadOnlyList<Role> Roles => _roles.AsReadOnly();

    private User() { }

    public static User Criar(string nome, string email, string passwordHash)
    {
        return new User
        {
            Id = Guid.CreateVersion7(),
            Nome = nome.Trim(),
            Email = email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            Ativo = true,
        };
    }

    public void AtribuirRole(Role role) => _roles.Add(role);
    public void RegistrarAcesso() => UltimoAcesso = DateTimeOffset.UtcNow;
    public void AtualizarSenha(string hash) => PasswordHash = hash;

    /// <summary>Define o tenant dono deste usuário (admin setup).</summary>
    public void DefinirTenant(Guid tenantId) => TenantId = tenantId;
}
