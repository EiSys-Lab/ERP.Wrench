using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.Catalogo;

/// <summary>Lista todas as peças do catálogo.</summary>
public sealed class ListarPecasEndpoint : EndpointWithoutRequest<List<PecaDto>>
{
    private readonly WrenchDbContext _db;

    public ListarPecasEndpoint(WrenchDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/api/pecas");
        Description(b => b.Produces<List<PecaDto>>().WithTags("Catalogo"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var pecas = await _db.Pecas.AsNoTracking().OrderBy(p => p.Nome).ToListAsync(ct);

        var dtos = pecas.Select(p => new PecaDto(
            p.Id,
            p.Codigo,
            p.Nome,
            p.CategoriaId,
            p.Compartimento,
            p.Unidade.Name,
            p.Preco,
            p.Custo,
            p.QuantidadeEstoque,
            p.EstoqueMinimo,
            p.AbaixoDoMinimo)).ToList();

        await SendAsync(dtos, cancellation: ct);
    }
}

public sealed record PecaDto(
    Guid Id,
    string Codigo,
    string Nome,
    Guid? CategoriaId,
    string Compartimento,
    string Unidade,
    decimal Preco,
    decimal? Custo,
    int QuantidadeEstoque,
    int EstoqueMinimo,
    bool AbaixoDoMinimo);
