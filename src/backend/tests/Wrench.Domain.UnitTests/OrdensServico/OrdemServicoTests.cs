using Shouldly;
using Wrench.Domain.OrdensServico;
using Wrench.Domain.OrdensServico.Events;

namespace Wrench.Domain.UnitTests.OrdensServico;

/// <summary>
/// Testes do agregado OrdemServico — núcleo do negócio da oficina.
/// Cobrem factories, invariantes, transições de status e cálculos.
/// </summary>
public class OrdemServicoTests
{
    private static readonly Guid ClienteId = Guid.CreateVersion7();
    private const string ClienteNome = "FRIGO Transportes";
    private const string Placa = "OCZ8034";
    private const string Modelo = "Scania R450";

    // ─── Factory Criar ──────────────────────────────────────────────

    [Fact]
    public void Criar_ComDadosValidos_RetornaOSComStatusAberta()
    {
        // Act
        var result = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo);

        // Assert
        result.IsError.ShouldBeFalse();
        var os = result.Value;
        os.ClienteId.ShouldBe(ClienteId);
        os.ClienteNome.ShouldBe(ClienteNome);
        os.VeiculoPlaca.ShouldBe("OCZ8034"); // uppercased
        os.VeiculoModelo.ShouldBe(Modelo);
        os.Status.ShouldBe(OsStatus.Aberta);
        os.Itens.ShouldBeEmpty();
        os.DataEntrada.ShouldBeGreaterThan(DateTimeOffset.UtcNow.AddMinutes(-1));
    }

    [Fact]
    public void Criar_ComClienteIdVazio_RetornaErro()
    {
        var result = OrdemServico.Criar(Guid.Empty, ClienteNome, Placa, Modelo);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.ClienteObrigatorio");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Criar_ComNomeVazio_RetornaErro(string nome)
    {
        var result = OrdemServico.Criar(ClienteId, nome, Placa, Modelo);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.ClienteNomeObrigatorio");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Criar_ComPlacaVazia_RetornaErro(string? placa)
    {
        var result = OrdemServico.Criar(ClienteId, ClienteNome, placa!, Modelo);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.VeiculoPlacaObrigatoria");
    }

    [Fact]
    public void Criar_DisparaEventoOsCriada()
    {
        var result = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo);

        result.Value.DomainEvents
            .ShouldHaveSingleItem()
            .ShouldBeOfType<Wrench.Domain.OrdensServico.Events.OsCriadaEvent>();
    }

    // ─── Adicionar Itens ────────────────────────────────────────────

    [Fact]
    public void AdicionarItemPeca_ComDadosValidos_AdicionaECalculaSubtotal()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AdicionarItemPeca(
            pecaId: Guid.CreateVersion7(),
            nome: "Lâmpada H4 12V",
            codigo: "H4-12",
            compartimento: "Balcão",
            quantidade: 2,
            precoUnitario: 30m);

        result.IsError.ShouldBeFalse();
        os.Itens.Count.ShouldBe(1);
        var item = os.Itens[0];
        item.Tipo.ShouldBe(OsItemTipo.Peca);
        item.Quantidade.ShouldBe(2);
        item.PrecoUnitario.ShouldBe(30m);
        item.Subtotal.ShouldBe(60m); // 2 × 30
        item.MaoDeObra.ShouldBe(0m);
        item.ValorFinal.ShouldBe(60m); // subtotal + MO
    }

    [Fact]
    public void AdicionarItemPeca_ComQuantidadeZero_RetornaErro()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AdicionarItemPeca(
            Guid.CreateVersion7(), "H4", "H4-12", "Balcão", 0, 30m);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.ItemQuantidadeInvalida");
    }

    [Fact]
    public void AdicionarItemPeca_ComPecaIdVazio_RetornaErro()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AdicionarItemPeca(
            Guid.Empty, "H4", "H4-12", "Balcão", 1, 30m);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.ItemPecaIdObrigatorio");
    }

    [Fact]
    public void AdicionarItemServico_ComDadosValidos_AdicionaMaoDeObra()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AdicionarItemServico(
            servicoId: Guid.CreateVersion7(),
            nome: "Socorro — básico",
            maoDeObra: 60m);

        result.IsError.ShouldBeFalse();
        os.Itens.Count.ShouldBe(1);
        var item = os.Itens[0];
        item.Tipo.ShouldBe(OsItemTipo.Servico);
        item.Subtotal.ShouldBe(0m); // serviços não têm subtotal de peça
        item.MaoDeObra.ShouldBe(60m);
        item.ValorFinal.ShouldBe(60m);
    }

    // ─── Cálculos de Total ──────────────────────────────────────────

    [Fact]
    public void Totais_ComPecasEServicos_CalculaCorretamente()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        os.AdicionarItemPeca(Guid.CreateVersion7(), "Lâmpada H4", "H4", "Balcão", 2, 30m);
        os.AdicionarItemPeca(Guid.CreateVersion7(), "Pingão 24V", "PING-24", "Gaveta 1", 3, 10m);
        os.AdicionarItemServico(Guid.CreateVersion7(), "Socorro", 80m);

        // TotalPecas = (2×30) + (3×10) = 90
        os.TotalPecas.ShouldBe(90m);
        // TotalMaoDeObra = 80
        os.TotalMaoDeObra.ShouldBe(80m);
        // TotalGeral = 90 + 80 - 0 = 170
        os.TotalGeral.ShouldBe(170m);
    }

    [Fact]
    public void AplicarDesconto_ReduzTotalGeral()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;
        os.AdicionarItemPeca(Guid.CreateVersion7(), "H4", "H4", "Balcão", 1, 100m);

        var result = os.AplicarDesconto(20m);

        result.IsError.ShouldBeFalse();
        os.TotalGeral.ShouldBe(80m); // 100 - 20
    }

    [Fact]
    public void AplicarDesconto_MaiorQueTotal_RetornaErro()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;
        os.AdicionarItemPeca(Guid.CreateVersion7(), "H4", "H4", "Balcão", 1, 100m);

        var result = os.AplicarDesconto(150m);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.DescontoMaiorQueTotal");
    }

    // ─── Transições de Status ───────────────────────────────────────

    [Fact]
    public void AvancarPara_DeAbertaParaAprovada_Sucesso()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AvancarPara(OsStatus.Aprovada);

        result.IsError.ShouldBeFalse();
        os.Status.ShouldBe(OsStatus.Aprovada);
    }

    [Fact]
    public void AvancarPara_DeAbertaParaEntregue_RetornaErroTransicaoInvalida()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AvancarPara(OsStatus.Entregue);

        result.IsError.ShouldBeTrue();
        result.FirstError.Code.ShouldBe("OrdemServico.TransicaoInvalida");
        os.Status.ShouldBe(OsStatus.Aberta); // não mudou
    }

    [Fact]
    public void AvancarPara_ParaCancelada_SemprePermitidoDeNaoTerminal()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;

        var result = os.AvancarPara(OsStatus.Cancelada);

        result.IsError.ShouldBeFalse();
        os.Status.ShouldBe(OsStatus.Cancelada);
        os.Status.IsTerminal.ShouldBeTrue();
    }

    [Fact]
    public void AvancarPara_DeConcluida_RetornaErroTerminal()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;
        // Avança até Concluida
        os.AvancarPara(OsStatus.Aprovada);
        os.AvancarPara(OsStatus.EmExecucao);
        os.AvancarPara(OsStatus.Pronta);
        os.AvancarPara(OsStatus.Faturada);
        os.AvancarPara(OsStatus.Entregue);
        os.AvancarPara(OsStatus.Concluida);

        var result = os.AvancarPara(OsStatus.Cancelada);

        result.IsError.ShouldBeTrue(); // terminal não pode mais mudar
    }

    // ─── Pagamento ──────────────────────────────────────────────────

    [Fact]
    public void RegistrarPagamento_Parcial_MudaStatusParaParcial()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;
        os.AdicionarItemPeca(Guid.CreateVersion7(), "H4", "H4", "Balcão", 1, 100m);

        os.RegistrarPagamento(40m);

        os.TotalPago.ShouldBe(40m);
        os.PagamentoStatus.ShouldBe(PagamentoStatus.Parcial);
    }

    [Fact]
    public void RegistrarPagamento_Total_MudaStatusParaPago()
    {
        var os = OrdemServico.Criar(ClienteId, ClienteNome, Placa, Modelo).Value;
        os.AdicionarItemPeca(Guid.CreateVersion7(), "H4", "H4", "Balcão", 1, 100m);

        os.RegistrarPagamento(100m);

        os.PagamentoStatus.ShouldBe(PagamentoStatus.Pago);
    }
}
