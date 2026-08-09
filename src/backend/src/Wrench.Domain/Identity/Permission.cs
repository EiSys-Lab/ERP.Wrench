using Wrench.Domain.Common;

namespace Wrench.Domain.Identity;

/// <summary>
/// Permissão granular (ex: "OrdensServico.Editar"). Vinculada a um Role.
/// </summary>
public sealed class Permission : Entity
{
    public string Modulo { get; private set; } = default!;
    public bool PodeAcessar { get; private set; }
    public bool PodeEditar { get; private set; }

    private Permission() { }

    public static Permission Criar(string modulo, bool acessar, bool editar)
    {
        return new Permission
        {
            Id = Guid.CreateVersion7(),
            Modulo = modulo.Trim(),
            PodeAcessar = acessar,
            PodeEditar = editar,
        };
    }
}
