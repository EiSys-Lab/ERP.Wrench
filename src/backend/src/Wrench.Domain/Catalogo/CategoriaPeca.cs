using ErrorOr;
using Wrench.Domain.Common;

namespace Wrench.Domain.Catalogo;

/// <summary>
/// Categoria de peça (Iluminação, Relé, Conector, etc).
/// Aggregate Root própria para permitir CRUD independente.
/// </summary>
public sealed class CategoriaPeca : AggregateRoot
{
    public string Nome { get; private set; } = default!;
    public string? Descricao { get; private set; }
    public bool Ativo { get; private set; } = true;

    private CategoriaPeca() { }

    public static ErrorOr<CategoriaPeca> Criar(string nome, string? descricao = null)
    {
        if (string.IsNullOrWhiteSpace(nome)) return CategoriaErrors.NomeObrigatorio;

        return new CategoriaPeca
        {
            Id = Guid.CreateVersion7(),
            Nome = nome.Trim(),
            Descricao = descricao?.Trim(),
            Ativo = true,
        };
    }
}

public static class CategoriaErrors
{
    public static Error NomeObrigatorio =>
        Error.Validation("Categoria.NomeObrigatorio", "Nome da categoria é obrigatório.");

    public static Error NaoEncontrada(Guid id) =>
        Error.NotFound("Categoria.NaoEncontrada", $"Categoria {id} não encontrada.");
}

/// <summary>Repositórios de catálogo.</summary>
public interface IPecaRepository : IRepository<Peca>
{
    Task<Peca?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<Peca?> GetByCodigoBarrasAsync(string codigoBarras, CancellationToken ct = default);
}

public interface IServicoRepository : IRepository<Servico>
{
    Task<Servico?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
}

public interface ICategoriaRepository : IRepository<CategoriaPeca> { }
