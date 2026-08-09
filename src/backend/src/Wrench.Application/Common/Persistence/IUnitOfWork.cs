namespace Wrench.Application.Common.Persistence;

/// <summary>
/// Unit of Work — ponto único de SaveChanges. Handlers não chamam
/// SaveChanges diretamente no DbContext; delegam aqui.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
