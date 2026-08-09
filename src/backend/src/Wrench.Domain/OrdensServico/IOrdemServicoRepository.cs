using Wrench.Domain.Common;

namespace Wrench.Domain.OrdensServico;

/// <summary>Repositório de OrdemServico (filtra por tenant no query filter).</summary>
public interface IOrdemServicoRepository : IRepository<OrdemServico>
{
    /// <summary>Busca OS por número humano (ex: 142).</summary>
    Task<OrdemServico?> GetByNumeroAsync(long numero, CancellationToken ct = default);

    /// <summary>Lista OS por status (para Kanban).</summary>
    Task<IReadOnlyList<OrdemServico>> ListByStatusAsync(OsStatus[] statuses, CancellationToken ct = default);

    /// <summary>Próximo número sequencial (para exibição antes do IDENTITY commit).</summary>
    Task<long> GetProximoNumeroAsync(CancellationToken ct = default);
}
