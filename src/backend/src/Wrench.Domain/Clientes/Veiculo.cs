using Wrench.Domain.Common;

namespace Wrench.Domain.Clientes;

/// <summary>
/// Veículo vinculado a um cliente. Entidade filha do agregado Cliente.
/// </summary>
public sealed class Veiculo : Entity
{
    public Guid ClienteId { get; private set; }
    public string Placa { get; private set; } = default!;
    public string Modelo { get; private set; } = default!;
    public string? Marca { get; private set; }
    public int? Ano { get; private set; }
    public string? Cor { get; private set; }

    private Veiculo() { }

    internal Veiculo(
        Guid id,
        Guid clienteId,
        string placa,
        string modelo,
        string? marca,
        int? ano,
        string? cor)
        : base(id)
    {
        ClienteId = clienteId;
        Placa = placa;
        Modelo = modelo;
        Marca = marca;
        Ano = ano;
        Cor = cor;
    }
}
