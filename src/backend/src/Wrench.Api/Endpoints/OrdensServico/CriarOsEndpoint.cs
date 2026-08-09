using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Persistence;
using Wrench.Domain.Clientes;
using Wrench.Domain.OrdensServico;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.OrdensServico;

/// <summary>Cria uma nova Ordem de Serviço com itens.</summary>
public sealed class CriarOsEndpoint : Endpoint<CriarOsRequest, CriarOsResponse>
{
    private readonly WrenchDbContext _db;
    private readonly IUnitOfWork _uow;

    public CriarOsEndpoint(WrenchDbContext db, IUnitOfWork uow)
    {
        _db = db;
        _uow = uow;
    }

    public override void Configure()
    {
        Post("/api/ordens-servico");
        Description(b => b.Produces<CriarOsResponse>(201).ProducesProblem(400).WithTags("OrdensServico"));
    }

    public override async Task HandleAsync(CriarOsRequest req, CancellationToken ct)
    {
        // Busca cliente para snapshot de nome + veículo.
        var cliente = await _db.Clientes
            .Include(c => c.Veiculos)
            .FirstOrDefaultAsync(c => c.Id == req.ClienteId, ct);

        if (cliente is null)
        {
            AddError(r => r.ClienteId, "Cliente não encontrado");
            await SendErrorsAsync(400, ct);
            return;
        }

        var veiculo = cliente.Veiculos.FirstOrDefault(v =>
            v.Placa.Equals(req.VeiculoPlaca, StringComparison.OrdinalIgnoreCase));

        if (veiculo is null)
        {
            AddError(r => r.VeiculoPlaca, "Veículo não encontrado para este cliente");
            await SendErrorsAsync(400, ct);
            return;
        }

        // Cria a OS via factory do domínio.
        var osResult = OrdemServico.Criar(
            req.ClienteId,
            cliente.Nome,
            veiculo.Placa,
            veiculo.Modelo,
            veiculo.Marca);

        if (osResult.IsError)
        {
            foreach (var err in osResult.Errors)
                AddError(err.Description);
            await SendErrorsAsync(400, ct);
            return;
        }

        var os = osResult.Value;
        os.AtribuirMecanico(req.MecanicoNome);
        os.DefinirObservacoes(req.Observacoes);

        // Adiciona itens de peça (busca preço/código do catálogo).
        foreach (var item in req.ItensPeca)
        {
            var peca = await _db.Pecas.FirstOrDefaultAsync(p => p.Id == item.PecaId, ct);
            if (peca is null)
            {
                AddError($"Peça {item.PecaId} não encontrada");
                continue;
            }

            os.AdicionarItemPeca(
                peca.Id,
                peca.Nome,
                peca.Codigo,
                peca.Compartimento,
                item.Quantidade,
                peca.Preco);
        }

        // Adiciona itens de serviço (M.O).
        foreach (var item in req.ItensServico)
        {
            var servico = await _db.Servicos.FirstOrDefaultAsync(s => s.Id == item.ServicoId, ct);
            if (servico is null)
            {
                AddError($"Serviço {item.ServicoId} não encontrado");
                continue;
            }

            os.AdicionarItemServico(servico.Id, servico.Nome, servico.ValorBase);
        }

        if (ValidationFailed)
        {
            await SendErrorsAsync(400, ct);
            return;
        }

        await _db.OrdensServico.AddAsync(os, ct);
        await _uow.SaveChangesAsync(ct);

        // Recarrega para pegar o Numero gerado pelo IDENTITY.
        await _db.Entry(os).ReloadAsync(ct);

        var response = new CriarOsResponse(
            os.Id,
            os.Numero,
            os.ClienteNome,
            os.VeiculoPlaca,
            os.Status.Name,
            os.TotalGeral);

        await SendCreatedAtAsync<ObterOsEndpoint>(
            routeValues: new { Numero = os.Numero },
            response,
            generateAbsoluteUrl: true,
            cancellation: ct);
    }
}

public sealed record CriarOsRequest(
    Guid ClienteId,
    string VeiculoPlaca,
    string? MecanicoNome,
    string? Observacoes,
    List<CriarOsItemPecaInput> ItensPeca,
    List<CriarOsItemServicoInput> ItensServico);

public sealed record CriarOsItemPecaInput(Guid PecaId, int Quantidade);

public sealed record CriarOsItemServicoInput(Guid ServicoId);

public sealed record CriarOsResponse(
    Guid Id,
    long Numero,
    string ClienteNome,
    string VeiculoPlaca,
    string Status,
    decimal TotalGeral);
