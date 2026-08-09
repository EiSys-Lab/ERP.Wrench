using Wrench.Domain.Common;

namespace Wrench.Domain.Clientes;

/// <summary>Repositório de Cliente (filtra por tenant).</summary>
public interface IClienteRepository : IRepository<Cliente>
{
    /// <summary>Busca cliente por documento (CPF/CNPJ).</summary>
    Task<Cliente?> GetByDocumentoAsync(string documento, CancellationToken ct = default);
}
