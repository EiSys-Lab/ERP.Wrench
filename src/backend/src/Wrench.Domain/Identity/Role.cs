using Wrench.Domain.Common;

namespace Wrench.Domain.Identity;

/// <summary>Perfil/papel de usuário (Administrador, Mecânico, Caixa, Contador).</summary>
public sealed class Role : Entity
{
    public string Nome { get; private set; } = default!;
    public string? Descricao { get; private set; }

    private readonly List<Permission> _permissoes = [];
    public IReadOnlyList<Permission> Permissoes => _permissoes.AsReadOnly();

    private Role() { }

    public static Role Criar(string nome, string? descricao = null)
    {
        return new Role
        {
            Id = Guid.CreateVersion7(),
            Nome = nome.Trim(),
            Descricao = descricao,
        };
    }

    public void AdicionarPermissao(Permission permissao) => _permissoes.Add(permissao);
}
