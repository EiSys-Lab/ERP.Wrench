using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.Clientes;

/// <summary>Lista todos os clientes com seus veículos.</summary>
public sealed class ListarClientesEndpoint : EndpointWithoutRequest<List<ClienteDto>>
{
    private readonly WrenchDbContext _db;

    public ListarClientesEndpoint(WrenchDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/api/clientes");
        Description(b => b.Produces<List<ClienteDto>>().WithTags("Clientes"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var clientes = await _db.Clientes
            .AsNoTracking()
            .Include(c => c.Veiculos)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(ct);

        var dtos = clientes.Select(c => new ClienteDto(
            c.Id,
            c.Nome,
            c.Tipo.Name,
            c.Documento,
            c.Telefone,
            c.Email,
            c.Ativo,
            c.Veiculos.Select(v => new VeiculoDto(v.Placa, v.Modelo, v.Marca, v.Ano, v.Cor)).ToList())).ToList();

        await SendAsync(dtos, cancellation: ct);
    }
}

public sealed record ClienteDto(
    Guid Id,
    string Nome,
    string Tipo,
    string? Documento,
    string? Telefone,
    string? Email,
    bool Ativo,
    List<VeiculoDto> Veiculos);

public sealed record VeiculoDto(
    string Placa,
    string Modelo,
    string? Marca,
    int? Ano,
    string? Cor);
