using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.Catalogo;

/// <summary>Lista todos os serviços (mão de obra) do catálogo.</summary>
public sealed class ListarServicosEndpoint : EndpointWithoutRequest<List<ServicoDto>>
{
    private readonly WrenchDbContext _db;

    public ListarServicosEndpoint(WrenchDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/api/servicos");
        Description(b => b.Produces<List<ServicoDto>>().WithTags("Catalogo"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var servicos = await _db.Servicos.AsNoTracking().OrderBy(s => s.Nome).ToListAsync(ct);

        var dtos = servicos.Select(s => new ServicoDto(
            s.Id,
            s.Codigo,
            s.Nome,
            s.Categoria,
            s.ValorBase,
            s.TempoEstimadoMin,
            s.Ativo)).ToList();

        await SendAsync(dtos, cancellation: ct);
    }
}

public sealed record ServicoDto(
    Guid Id,
    string Codigo,
    string Nome,
    string Categoria,
    decimal ValorBase,
    int? TempoEstimadoMin,
    bool Ativo);
