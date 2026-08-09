using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Persistence;
using Wrench.Domain.OrdensServico;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.OrdensServico;

/// <summary>Avança o status de uma OS (Kanban drag-and-drop).</summary>
public sealed class AvancarOsEndpoint : Endpoint<AvancarOsRequest>
{
    private readonly WrenchDbContext _db;
    private readonly IUnitOfWork _uow;

    public AvancarOsEndpoint(WrenchDbContext db, IUnitOfWork uow)
    {
        _db = db;
        _uow = uow;
    }

    public override void Configure()
    {
        Post("/api/ordens-servico/{Id}/avancar");
        Description(b => b.Produces(200).ProducesProblem(400).ProducesProblem(404).WithTags("OrdensServico"));
    }

    public override async Task HandleAsync(AvancarOsRequest req, CancellationToken ct)
    {
        var id = Route<Guid>("Id");
        var os = await _db.OrdensServico.FirstOrDefaultAsync(o => o.Id == id, ct);

        if (os is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        if (!OsStatus.TryFromName(req.StatusDestino, out var destino))
        {
            AddError(r => r.StatusDestino, $"Status '{req.StatusDestino}' inválido");
            await SendErrorsAsync(400, ct);
            return;
        }

        var result = os.AvancarPara(destino);
        if (result.IsError)
        {
            foreach (var err in result.Errors)
                AddError(err.Description);
            await SendErrorsAsync(409, ct);
            return;
        }

        await _uow.SaveChangesAsync(ct);
        await SendOkAsync(ct);
    }
}

public sealed record AvancarOsRequest(string StatusDestino);
