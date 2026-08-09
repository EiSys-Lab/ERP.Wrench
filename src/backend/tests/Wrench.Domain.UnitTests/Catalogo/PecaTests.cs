using Shouldly;
using Wrench.Domain.Catalogo;

namespace Wrench.Domain.UnitTests.Catalogo;

/// <summary>
/// Testes do agregado Peca — valida invariantes de criação,
/// baixa de estoque e cálculo de margem.
/// </summary>
public class PecaTests
{
    [Fact]
    public void Criar_ComDadosValidos_RetornaPecaAtiva()
    {
        var result = Peca.Criar("H4-12", "Lâmpada H4 12V", "Balcão", 30m, estoqueMinimo: 10);

        result.IsError.ShouldBeFalse();
        var peca = result.Value;
        peca.Codigo.ShouldBe("H4-12"); // uppercased
        peca.Nome.ShouldBe("Lâmpada H4 12V");
        peca.Preco.ShouldBe(30m);
        peca.Ativo.ShouldBeTrue();
        peca.AbaixoDoMinimo.ShouldBeTrue(); // estoque 0 < mínimo 10
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Criar_ComCodigoVazio_RetornaErro(string codigo)
    {
        var result = Peca.Criar(codigo, "Nome", "Balcão", 10m);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Peca.CodigoObrigatorio");
    }

    [Fact]
    public void Criar_ComPrecoNegativo_RetornaErro()
    {
        var result = Peca.Criar("COD", "Nome", "Balcão", -5m);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Peca.PrecoInvalido");
    }

    [Fact]
    public void Criar_ComEstoqueMaximoMenorQueMinimo_RetornaErro()
    {
        var result = Peca.Criar("COD", "Nome", "Balcão", 10m, estoqueMinimo: 20, estoqueMaximo: 10);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Peca.EstoqueMaximoMenorQueMinimo");
    }

    [Fact]
    public void DebitarEstoque_ComSaldoSuficiente_Decrementa()
    {
        var peca = Peca.Criar("COD", "Nome", "Balcão", 10m, quantidadeEstoque: 50).Value;

        var result = peca.DebitarEstoque(5);

        result.IsError.ShouldBeFalse();
        peca.QuantidadeEstoque.ShouldBe(45);
    }

    [Fact]
    public void DebitarEstoque_ComSaldoInsuficiente_RetornaErro()
    {
        var peca = Peca.Criar("COD", "Nome", "Balcão", 10m, quantidadeEstoque: 3).Value;

        var result = peca.DebitarEstoque(5);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Peca.EstoqueInsuficiente");
        peca.QuantidadeEstoque.ShouldBe(3); // não mudou
    }

    [Fact]
    public void DebitarEstoque_ComQuantidadeZero_RetornaErro()
    {
        var peca = Peca.Criar("COD", "Nome", "Balcão", 10m, quantidadeEstoque: 10).Value;

        var result = peca.DebitarEstoque(0);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Peca.QuantidadeInvalida");
    }

    [Fact]
    public void Margem_ComCusto_CalculaCorretamente()
    {
        var peca = Peca.Criar("COD", "Nome", "Balcão", 100m, custo: 60m).Value;

        peca.Margem.ShouldBe(0.4m); // (100-60)/100 = 0.4
    }

    [Fact]
    public void Margem_SemCusto_RetornaNull()
    {
        var peca = Peca.Criar("COD", "Nome", "Balcão", 100m).Value;

        peca.Margem.ShouldBeNull();
    }
}
