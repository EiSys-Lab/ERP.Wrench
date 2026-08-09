using Shouldly;
using Wrench.Domain.Estoque;
using Wrench.Domain.Estoque.Events;

namespace Wrench.Domain.UnitTests.Estoque;

/// <summary>
/// Testes do agregado MovimentoEstoque (trilha imutável RN-002).
/// Valida criação, ajustes exigindo motivo, e saldo resultante não negativo.
/// </summary>
public class MovimentoEstoqueTests
{
    private static readonly Guid PecaId = Guid.CreateVersion7();

    [Fact]
    public void Criar_Entrada_ComDadosValidos_CalculaSaldoResultante()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.Entrada, quantidade: 10, saldoAnterior: 5,
            documentoOrigem: "NF-001");

        result.IsError.ShouldBeFalse();
        var mov = result.Value;
        mov.Tipo.ShouldBe(TipoMovimento.Entrada);
        mov.SaldoAnterior.ShouldBe(5);
        mov.SaldoResultante.ShouldBe(15); // 5 + 10
        mov.Quantidade.ShouldBe(10);
    }

    [Fact]
    public void Criar_Saida_ComSaldoSuficiente_Decrementa()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.Saida, quantidade: 3, saldoAnterior: 10,
            documentoOrigem: "OS-0142");

        result.IsError.ShouldBeFalse();
        result.Value.SaldoResultante.ShouldBe(7); // 10 - 3
    }

    [Fact]
    public void Criar_Saida_ComSaldoInsuficiente_RetornaErro()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.Saida, quantidade: 15, saldoAnterior: 10,
            documentoOrigem: "OS-0142");

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Movimento.SaldoResultanteNegativo");
    }

    [Fact]
    public void Criar_AjustePositivo_SemMotivo_RetornaErro()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.AjustePositivo, quantidade: 5, saldoAnterior: 10);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Movimento.MotivoObrigatorioParaAjuste");
    }

    [Fact]
    public void Criar_AjustePositivo_ComMotivo_Sucesso()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.AjustePositivo, quantidade: 5, saldoAnterior: 10,
            motivo: "Ajuste de inventário");

        result.IsError.ShouldBeFalse();
        result.Value.SaldoResultante.ShouldBe(15);
    }

    [Fact]
    public void Criar_AjusteNegativo_SemMotivo_RetornaErro()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.AjusteNegativo, quantidade: 5, saldoAnterior: 10);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Movimento.MotivoObrigatorioParaAjuste");
    }

    [Fact]
    public void Criar_ComQuantidadeZero_RetornaErro()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.Entrada, quantidade: 0, saldoAnterior: 10);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Movimento.QuantidadeInvalida");
    }

    [Fact]
    public void Criar_DisparaEventoEstoqueMovimentado()
    {
        var result = MovimentoEstoque.Criar(
            PecaId, "H4-12", "Lâmpada H4 12V",
            TipoMovimento.Entrada, quantidade: 5, saldoAnterior: 10);

        result.Value.DomainEvents
            .ShouldHaveSingleItem()
            .ShouldBeOfType<Wrench.Domain.Estoque.Events.EstoqueMovimentadoEvent>();
    }

    [Fact]
    public void Criar_ComPecaIdVazio_RetornaErro()
    {
        var result = MovimentoEstoque.Criar(
            Guid.Empty, "H4-12", "Lâmpada",
            TipoMovimento.Entrada, quantidade: 5, saldoAnterior: 10);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("Movimento.PecaObrigatoria");
    }
}
