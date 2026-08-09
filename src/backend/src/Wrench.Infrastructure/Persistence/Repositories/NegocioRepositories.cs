using Microsoft.EntityFrameworkCore;
using Wrench.Domain.Catalogo;
using Wrench.Domain.Clientes;
using Wrench.Domain.Common;
using Wrench.Domain.Estoque;
using Wrench.Domain.OrdensServico;

namespace Wrench.Infrastructure.Persistence.Repositories;

// ─── OrdemServico ───
internal sealed class OrdemServicoRepository : IOrdemServicoRepository
{
    private readonly WrenchDbContext _db;
    public OrdemServicoRepository(WrenchDbContext db) => _db = db;

    public Task<OrdemServico?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.OrdensServico.Include(o => o.Itens).FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IReadOnlyList<OrdemServico>> ListAsync(CancellationToken ct = default) =>
        await _db.OrdensServico.AsNoTracking().Include(o => o.Itens)
            .OrderByDescending(o => o.Numero).ToListAsync(ct);

    public Task<OrdemServico?> GetByNumeroAsync(long numero, CancellationToken ct = default) =>
        _db.OrdensServico.Include(o => o.Itens).FirstOrDefaultAsync(o => o.Numero == numero, ct);

    public async Task<IReadOnlyList<OrdemServico>> ListByStatusAsync(
        OsStatus[] statuses, CancellationToken ct = default) =>
        await _db.OrdensServico.AsNoTracking().Include(o => o.Itens)
            .Where(o => statuses.Contains(o.Status))
            .OrderByDescending(o => o.DataEntrada).ToListAsync(ct);

    public async Task<long> GetProximoNumeroAsync(CancellationToken ct = default) =>
        (await _db.OrdensServico.AsNoTracking().MaxAsync(o => (long?)o.Numero, ct) ?? 0) + 1;

    public async Task AddAsync(OrdemServico os, CancellationToken ct = default) =>
        await _db.OrdensServico.AddAsync(os, ct);

    public void Update(OrdemServico os) => _db.OrdensServico.Update(os);
    public void Remove(OrdemServico os) => _db.OrdensServico.Remove(os);
}

// ─── Cliente ───
internal sealed class ClienteRepository : IClienteRepository
{
    private readonly WrenchDbContext _db;
    public ClienteRepository(WrenchDbContext db) => _db = db;

    public Task<Cliente?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Clientes.Include(c => c.Veiculos).FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<IReadOnlyList<Cliente>> ListAsync(CancellationToken ct = default) =>
        await _db.Clientes.AsNoTracking().Include(c => c.Veiculos)
            .OrderByDescending(c => c.CreatedAt).ToListAsync(ct);

    public Task<Cliente?> GetByDocumentoAsync(string documento, CancellationToken ct = default) =>
        _db.Clientes.Include(c => c.Veiculos)
            .FirstOrDefaultAsync(c => c.Documento == documento, ct);

    public async Task AddAsync(Cliente cliente, CancellationToken ct = default) =>
        await _db.Clientes.AddAsync(cliente, ct);

    public void Update(Cliente cliente) => _db.Clientes.Update(cliente);
    public void Remove(Cliente cliente) => _db.Clientes.Remove(cliente);
}

// ─── Peca ───
internal sealed class PecaRepository : IPecaRepository
{
    private readonly WrenchDbContext _db;
    public PecaRepository(WrenchDbContext db) => _db = db;

    public Task<Peca?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Pecas.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<Peca>> ListAsync(CancellationToken ct = default) =>
        await _db.Pecas.AsNoTracking().OrderBy(p => p.Nome).ToListAsync(ct);

    public Task<Peca?> GetByCodigoAsync(string codigo, CancellationToken ct = default) =>
        _db.Pecas.FirstOrDefaultAsync(p => p.Codigo == codigo.ToUpperInvariant(), ct);

    public Task<Peca?> GetByCodigoBarrasAsync(string codigoBarras, CancellationToken ct = default) =>
        _db.Pecas.FirstOrDefaultAsync(p => p.CodigoBarras == codigoBarras, ct);

    public async Task AddAsync(Peca peca, CancellationToken ct = default) =>
        await _db.Pecas.AddAsync(peca, ct);

    public void Update(Peca peca) => _db.Pecas.Update(peca);
    public void Remove(Peca peca) => _db.Pecas.Remove(peca);
}

// ─── Servico ───
internal sealed class ServicoRepository : IServicoRepository
{
    private readonly WrenchDbContext _db;
    public ServicoRepository(WrenchDbContext db) => _db = db;

    public Task<Servico?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Servicos.FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<IReadOnlyList<Servico>> ListAsync(CancellationToken ct = default) =>
        await _db.Servicos.AsNoTracking().OrderBy(s => s.Nome).ToListAsync(ct);

    public Task<Servico?> GetByCodigoAsync(string codigo, CancellationToken ct = default) =>
        _db.Servicos.FirstOrDefaultAsync(s => s.Codigo == codigo.ToUpperInvariant(), ct);

    public async Task AddAsync(Servico servico, CancellationToken ct = default) =>
        await _db.Servicos.AddAsync(servico, ct);

    public void Update(Servico servico) => _db.Servicos.Update(servico);
    public void Remove(Servico servico) => _db.Servicos.Remove(servico);
}

// ─── CategoriaPeca ───
internal sealed class CategoriaPecaRepository : ICategoriaRepository
{
    private readonly WrenchDbContext _db;
    public CategoriaPecaRepository(WrenchDbContext db) => _db = db;

    public Task<CategoriaPeca?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.CategoriasPeca.FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<IReadOnlyList<CategoriaPeca>> ListAsync(CancellationToken ct = default) =>
        await _db.CategoriasPeca.AsNoTracking().OrderBy(c => c.Nome).ToListAsync(ct);

    public async Task AddAsync(CategoriaPeca categoria, CancellationToken ct = default) =>
        await _db.CategoriasPeca.AddAsync(categoria, ct);

    public void Update(CategoriaPeca categoria) => _db.CategoriasPeca.Update(categoria);
    public void Remove(CategoriaPeca categoria) => _db.CategoriasPeca.Remove(categoria);
}

// ─── MovimentoEstoque ───
internal sealed class MovimentoEstoqueRepository : IMovimentoEstoqueRepository
{
    private readonly WrenchDbContext _db;
    public MovimentoEstoqueRepository(WrenchDbContext db) => _db = db;

    public async Task<IReadOnlyList<MovimentoEstoque>> ListByPecaAsync(Guid pecaId, CancellationToken ct = default) =>
        await _db.MovimentosEstoque.AsNoTracking()
            .Where(m => m.PecaId == pecaId)
            .OrderByDescending(m => m.DataMovimento).ToListAsync(ct);

    public async Task<IReadOnlyList<MovimentoEstoque>> ListRecentesAsync(int take, CancellationToken ct = default) =>
        await _db.MovimentosEstoque.AsNoTracking()
            .OrderByDescending(m => m.DataMovimento).Take(take).ToListAsync(ct);

    public async Task AddAsync(MovimentoEstoque movimento, CancellationToken ct = default) =>
        await _db.MovimentosEstoque.AddAsync(movimento, ct);

    public async Task<int> GetSaldoAtualAsync(Guid pecaId, CancellationToken ct = default)
    {
        var ultimo = await _db.MovimentosEstoque.AsNoTracking()
            .Where(m => m.PecaId == pecaId)
            .OrderByDescending(m => m.DataMovimento)
            .FirstOrDefaultAsync(ct);
        return ultimo?.SaldoResultante ?? 0;
    }
}
