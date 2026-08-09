using Shouldly;
using Wrench.Domain.Clientes;

namespace Wrench.Domain.UnitTests.Clientes;

/// <summary>
/// Testes do agregado Cliente — valida criação, adição de veículos
/// e validação de duplicidade.
/// </summary>
public class ClienteTests
{
    [Fact]
    public void Criar_ComDadosValidos_RetornaClientePessoaFisica()
    {
        var result = Cliente.Criar("Eliane Silva", documento: "123.456.789-01");

        result.IsError.ShouldBeFalse();
        var cliente = result.Value;
        cliente.Nome.ShouldBe("Eliane Silva");
        cliente.Tipo.ShouldBe(ClienteTipo.PessoaFisica);
        cliente.Ativo.ShouldBeTrue();
        cliente.Veiculos.ShouldBeEmpty();
    }

    [Fact]
    public void Criar_ComNomeVazio_RetornaErro()
    {
        var result = Cliente.Criar("");

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Cliente.NomeObrigatorio");
    }

    [Fact]
    public void AdicionarVeiculo_ComDadosValidos_Adiciona()
    {
        var cliente = Cliente.Criar("FRIGO").Value;

        var result = cliente.AdicionarVeiculo("OCZ8034", "Scania R450", "Scania", 2022, "Branco");

        result.IsError.ShouldBeFalse();
        cliente.Veiculos.Count.ShouldBe(1);
        var v = cliente.Veiculos[0];
        v.Placa.ShouldBe("OCZ8034"); // uppercased
        v.Modelo.ShouldBe("Scania R450");
        v.ClienteId.ShouldBe(cliente.Id);
    }

    [Fact]
    public void AdicionarVeiculo_ComPlacaDuplicada_RetornaErro()
    {
        var cliente = Cliente.Criar("FRIGO").Value;
        cliente.AdicionarVeiculo("OCZ8034", "Scania");

        var result = cliente.AdicionarVeiculo("ocz8034", "Outro modelo"); // case insensitive

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Cliente.VeiculoDuplicado");
        cliente.Veiculos.Count.ShouldBe(1); // não duplicou
    }

    [Fact]
    public void AdicionarVeiculo_ComPlacaVazia_RetornaErro()
    {
        var cliente = Cliente.Criar("FRIGO").Value;

        var result = cliente.AdicionarVeiculo("", "Scania");

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Cliente.VeiculoPlacaObrigatoria");
    }
}
