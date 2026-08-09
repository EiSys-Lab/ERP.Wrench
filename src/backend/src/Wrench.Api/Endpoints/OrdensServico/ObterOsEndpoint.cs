using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Domain.OrdensServico;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.OrdensServico;

/// <summary>Obtem OS por número (detalhe completo com itens).</summary>
public sealed class ObterOsEndpoint : EndpointWithoutRequest<OsDetalheDto>
{
    private readonly WrenchDbContext _db;

    public ObterOsEndpoint(WrenchDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/api/ordens-servico/{Numero}");
        Description(b => b.Produces<OsDetalheDto>(200).ProducesProblem(404).WithTags("OrdensServico"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var numero = Route<long>("Numero");
        var os = await _db.OrdensServico
            .AsNoTracking()
            .Include(o => o.Itens)
            .FirstOrDefaultAsync(o => o.Numero == numero, ct);

        if (os is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var dto = new OsDetalheDto(
            os.Id,
            os.Numero,
            os.ClienteId,
            os.ClienteNome,
            os.VeiculoPlaca,
            os.VeiculoModelo,
            os.VeiculoMarca,
            os.MecanicoNome,
            os.Status.Name,
            os.Itens.Select(i => new OsItemDto(
                i.Id,
                i.Tipo.Name,
                i.Nome,
                i.Codigo,
                i.Compartimento,
                i.Quantidade,
                i.PrecoUnitario,
                i.Subtotal,
                i.MaoDeObra,
                i.ValorFinal)).ToList(),
            os.TotalPecas,
            os.TotalMaoDeObra,
            os.Desconto,
            os.TotalGeral,
            os.TotalPago,
            os.PagamentoStatus.Name,
            os.DataEntrada.ToString("O"),
            os.DataSaida?.ToString("O"),
            os.Observacoes);

        await SendAsync(dto, cancellation: ct);
    }
}

public sealed record OsDetalheDto(
    Guid Id,
    long Numero,
    Guid ClienteId,
    string ClienteNome,
    string VeiculoPlaca,
    string VeiculoModelo,
    string? VeiculoMarca,
    string? MecanicoNome,
    string Status,
    List<OsItemDto> Itens,
    decimal TotalPecas,
    decimal TotalMaoDeObra,
    decimal Desconto,
    decimal TotalGeral,
    decimal TotalPago,
    string PagamentoStatus,
    string DataEntrada,
    string? DataSaida,
    string? Observacoes);

public sealed record OsItemDto(
    Guid Id,
    string Tipo,
    string Nome,
    string? Codigo,
    string? Compartimento,
    int Quantidade,
    decimal PrecoUnitario,
    decimal Subtotal,
    decimal MaoDeObra,
    decimal ValorFinal);
