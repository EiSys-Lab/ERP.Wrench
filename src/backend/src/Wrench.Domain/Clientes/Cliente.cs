using Ardalis.SmartEnum;
using ErrorOr;
using Wrench.Domain.Common;

namespace Wrench.Domain.Clientes;

/// <summary>Tipo de cliente (PF, PJ ou Especial — tratamento diferenciado).</summary>
public sealed class ClienteTipo : SmartEnum<ClienteTipo>
{
    public static readonly ClienteTipo PessoaFisica = new("PessoaFisica", 1);
    public static readonly ClienteTipo PessoaJuridica = new("PessoaJuridica", 2);
    public static readonly ClienteTipo Especial = new("Especial", 3);

    private ClienteTipo(string name, int value) : base(name, value) { }
}

/// <summary>Aggregate Root de Cliente. Tem lista de veículos vinculados.</summary>
public sealed class Cliente : AggregateRoot
{
    public string Nome { get; private set; } = default!;
    public ClienteTipo Tipo { get; private set; } = ClienteTipo.PessoaFisica;
    public string? Documento { get; private set; }
    public string? Telefone { get; private set; }
    public string? Email { get; private set; }
    public string? Endereco { get; private set; }
    public bool Ativo { get; private set; } = true;

    private readonly List<Veiculo> _veiculos = [];
    public IReadOnlyList<Veiculo> Veiculos => _veiculos.AsReadOnly();

    private Cliente() { }

    public static ErrorOr<Cliente> Criar(
        string nome,
        ClienteTipo? tipo = null,
        string? documento = null,
        string? telefone = null,
        string? email = null)
    {
        if (string.IsNullOrWhiteSpace(nome)) return ClienteErrors.NomeObrigatorio;

        return new Cliente
        {
            Id = Guid.CreateVersion7(),
            Nome = nome.Trim(),
            Tipo = tipo ?? ClienteTipo.PessoaFisica,
            Documento = documento?.Trim(),
            Telefone = telefone?.Trim(),
            Email = email?.Trim().ToLowerInvariant(),
            Ativo = true,
        };
    }

    public ErrorOr<Success> AdicionarVeiculo(string placa, string modelo, string? marca = null, int? ano = null, string? cor = null)
    {
        if (string.IsNullOrWhiteSpace(placa)) return ClienteErrors.VeiculoPlacaObrigatoria;
        if (string.IsNullOrWhiteSpace(modelo)) return ClienteErrors.VeiculoModeloObrigatorio;

        // Não duplica placa no mesmo cliente.
        if (_veiculos.Any(v => v.Placa.Equals(placa, StringComparison.OrdinalIgnoreCase)))
            return ClienteErrors.VeiculoDuplicado;

        _veiculos.Add(new Veiculo(Guid.CreateVersion7(), Id, placa.Trim().ToUpperInvariant(), modelo.Trim(), marca?.Trim(), ano, cor?.Trim()));
        return Result.Success;
    }

    public void AtualizarContato(string? telefone, string? email, string? endereco)
    {
        Telefone = string.IsNullOrWhiteSpace(telefone) ? null : telefone.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
        Endereco = string.IsNullOrWhiteSpace(endereco) ? null : endereco.Trim();
    }
}

/// <summary>Erros de domínio de Cliente.</summary>
public static class ClienteErrors
{
    public static Error NomeObrigatorio =>
        Error.Validation("Cliente.NomeObrigatorio", "Nome do cliente é obrigatório.");

    public static Error VeiculoPlacaObrigatoria =>
        Error.Validation("Cliente.VeiculoPlacaObrigatoria", "Placa do veículo é obrigatória.");

    public static Error VeiculoModeloObrigatorio =>
        Error.Validation("Cliente.VeiculoModeloObrigatorio", "Modelo do veículo é obrigatório.");

    public static Error VeiculoDuplicado =>
        Error.Conflict("Cliente.VeiculoDuplicado", "Este veículo já está vinculado ao cliente.");

    public static Error NaoEncontrado(Guid id) =>
        Error.NotFound("Cliente.NaoEncontrado", $"Cliente {id} não encontrado.");
}
