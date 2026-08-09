using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Domain.OrdensServico;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.OrdensServico;

/// <summary>Lista OS com filtro opcional por status (para Kanban).</summary>
public sealed class ListarOsEndpoint : EndpointWithoutRequest<List<OsSummaryDto>>
{
    private readonly WrenchDbContext _db;

    public ListarOsEndpoint(WrenchDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/api/ordens-servico");
        Description(b => b.Produces<List<OsSummaryDto>>().WithTags("OrdensServico"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var statusQuery = Query<string?>("status");

        IQueryable<Wrench.Domain.OrdensServico.OrdemServico> query = _db.OrdensServico
            .AsNoTracking()
            .Include(o => o.Itens)
            .OrderByDescending(o => o.Numero);

        if (!string.IsNullOrWhiteSpace(statusQuery) && OsStatus.TryFromName(statusQuery, out var status))
        {
            query = query.Where(o => o.Status == status);
        }

        var ordens = await query.ToListAsync(ct);

        var dtos = ordens.Select(o => new OsSummaryDto(
            o.Id,
            o.Numero,
            o.ClienteNome,
            o.VeiculoPlaca,
            o.VeiculoModelo,
            o.Status.Name,
            o.TotalPecas,
            o.TotalMaoDeObra,
            o.TotalGeral,
            o.PagamentoStatus.Name,
            o.DataEntrada.ToString("O"),
            o.Itens.Count)).ToList();

        await SendAsync(dtos, cancellation: ct);
    }
}

/// <summary>DTO resumido de OS (lista/Kanban).</summary>
public sealed record OsSummaryDto(
    Guid Id,
    long Numero,
    string ClienteNome,
    string VeiculoPlaca,
    string VeiculoModelo,
    string Status,
    decimal TotalPecas,
    decimal TotalMaoDeObra,
    decimal TotalGeral,
    string PagamentoStatus,
    string DataEntrada,
    int ItensCount);
