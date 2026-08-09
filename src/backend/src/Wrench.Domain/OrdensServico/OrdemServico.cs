using ErrorOr;
using Wrench.Domain.Common;
using Wrench.Domain.OrdensServico.Events;

namespace Wrench.Domain.OrdensServico;

/// <summary>
/// Aggregate Root de Ordem de Serviço — núcleo da oficina.
///
/// Agrupa itens (peças + mão de obra) por cliente + veículo, com fluxo de
/// status controlado (Kanban: Aberta → Execucao → Pronta → Faturada → Entregue).
/// Substitui o "Pedido" do Indagor, adaptado para oficina autoelétrica.
///
/// Totais são calculados (computed): totalPecas, totalMaoDeObra, totalGeral.
/// </summary>
public sealed class OrdemServico : AggregateRoot
{
    /// <summary>Número humano sequencial (#142 etc). Gerado pelo Postgres IDENTITY.</summary>
    public long Numero { get; private set; }

    public Guid ClienteId { get; private set; }

    /// <summary>Snapshot do nome do cliente (preserva histórico).</summary>
    public string ClienteNome { get; private set; } = default!;

    /// <summary>Veículo em ValueObject (placa + modelo).</summary>
    public string VeiculoPlaca { get; private set; } = default!;
    public string VeiculoModelo { get; private set; } = default!;
    public string? VeiculoMarca { get; private set; }

    /// <summary>Mecânico responsável pela execução.</summary>
    public string? MecanicoNome { get; private set; }

    public OsStatus Status { get; private set; } = OsStatus.Aberta;

    private readonly List<OsItem> _itens = [];
    public IReadOnlyList<OsItem> Itens => _itens.AsReadOnly();

    public decimal Desconto { get; private set; }

    /// <summary>Σ subtotais dos itens peça.</summary>
    public decimal TotalPecas => _itens.Where(i => i.Tipo == OsItemTipo.Peca).Sum(i => i.Subtotal);

    /// <summary>Σ mão de obra dos itens.</summary>
    public decimal TotalMaoDeObra => _itens.Sum(i => i.MaoDeObra);

    /// <summary>= TotalPecas + TotalMaoDeObra - Desconto.</summary>
    public decimal TotalGeral => TotalPecas + TotalMaoDeObra - Desconto;

    /// <summary>Valor já pago (Σ pagamentos). Mock por ora.</summary>
    public decimal TotalPago { get; private set; }

    public PagamentoStatus PagamentoStatus { get; private set; } = PagamentoStatus.Pendente;

    public DateTimeOffset DataEntrada { get; private set; }
    public DateTimeOffset? DataSaida { get; private set; }
    public string? Observacoes { get; private set; }

    private OrdemServico() { }

    private OrdemServico(
        Guid id,
        Guid clienteId,
        string clienteNome,
        string veiculoPlaca,
        string veiculoModelo,
        string? veiculoMarca)
        : base(id)
    {
        ClienteId = clienteId;
        ClienteNome = clienteNome;
        VeiculoPlaca = veiculoPlaca;
        VeiculoModelo = veiculoModelo;
        VeiculoMarca = veiculoMarca;
        Status = OsStatus.Aberta;
        DataEntrada = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Factory — cria uma OS em rascunho (sem itens). Itens adicionados depois.
    /// </summary>
    public static ErrorOr<OrdemServico> Criar(
        Guid clienteId,
        string clienteNome,
        string veiculoPlaca,
        string veiculoModelo,
        string? veiculoMarca = null)
    {
        if (clienteId == Guid.Empty) return OsErrors.ClienteObrigatorio;
        if (string.IsNullOrWhiteSpace(clienteNome)) return OsErrors.ClienteNomeObrigatorio;
        if (string.IsNullOrWhiteSpace(veiculoPlaca)) return OsErrors.VeiculoPlacaObrigatoria;
        if (string.IsNullOrWhiteSpace(veiculoModelo)) return OsErrors.VeiculoModeloObrigatorio;

        var os = new OrdemServico(
            Guid.CreateVersion7(),
            clienteId,
            clienteNome.Trim(),
            veiculoPlaca.Trim().ToUpperInvariant(),
            veiculoModelo.Trim(),
            veiculoMarca?.Trim())
        {
            DataEntrada = DateTimeOffset.UtcNow,
        };

        os.Raise(new OsCriadaEvent(os.Id, clienteId, veiculoPlaca.ToUpperInvariant()));
        return os;
    }

    /// <summary>Atribui/atualiza o mecânico responsável.</summary>
    public void AtribuirMecanico(string? nome)
    {
        MecanicoNome = string.IsNullOrWhiteSpace(nome) ? null : nome.Trim();
    }

    /// <summary>Define observações da OS.</summary>
    public void DefinirObservacoes(string? obs)
    {
        Observacoes = string.IsNullOrWhiteSpace(obs) ? null : obs.Trim();
    }

    /// <summary>
    /// Adiciona um item de peça com snapshot (nome/código/compartimento do
    /// momento). Valida quantidade e preço.
    /// </summary>
    public ErrorOr<Success> AdicionarItemPeca(
        Guid pecaId,
        string nome,
        string? codigo,
        string? compartimento,
        int quantidade,
        decimal precoUnitario)
    {
        if (pecaId == Guid.Empty) return OsErrors.ItemPecaIdObrigatorio;
        if (string.IsNullOrWhiteSpace(nome)) return OsErrors.ItemNomeObrigatorio;
        if (quantidade <= 0) return OsErrors.ItemQuantidadeInvalida;
        if (precoUnitario < 0) return OsErrors.ItemPrecoInvalido;

        _itens.Add(new OsItem(
            Guid.CreateVersion7(),
            OsItemTipo.Peca,
            nome.Trim(),
            quantidade,
            precoUnitario,
            maoDeObra: 0,
            pecaId: pecaId,
            codigo: codigo,
            compartimento: compartimento));

        return Result.Success;
    }

    /// <summary>
    /// Adiciona um item de serviço (mão de obra). Preço unitário zero, valor
    /// vai direto para MaoDeObra.
    /// </summary>
    public ErrorOr<Success> AdicionarItemServico(
        Guid servicoId,
        string nome,
        decimal maoDeObra)
    {
        if (servicoId == Guid.Empty) return OsErrors.ItemServicoIdObrigatorio;
        if (string.IsNullOrWhiteSpace(nome)) return OsErrors.ItemNomeObrigatorio;
        if (maoDeObra < 0) return OsErrors.ItemMaoDeObraInvalida;

        _itens.Add(new OsItem(
            Guid.CreateVersion7(),
            OsItemTipo.Servico,
            nome.Trim(),
            quantidade: 1,
            precoUnitario: 0,
            maoDeObra: maoDeObra,
            servicoId: servicoId));

        return Result.Success;
    }

    /// <summary>Transição controlada de status — valida com OsStatus.PodeTransitarPara.</summary>
    public ErrorOr<Success> AvancarPara(OsStatus destino)
    {
        if (!OsStatus.PodeTransitarPara(Status, destino))
            return OsErrors.TransicaoInvalida(Status.Name, destino.Name);

        Status = destino;

        // Quando entrega, marca data de saída.
        if (destino == OsStatus.Entregue && DataSaida is null)
            DataSaida = DateTimeOffset.UtcNow;

        return Result.Success;
    }

    /// <summary>Aplica desconto (não pode exceder o total).</summary>
    public ErrorOr<Success> AplicarDesconto(decimal desconto)
    {
        if (desconto < 0) return OsErrors.DescontoInvalido;
        if (desconto > TotalPecas + TotalMaoDeObra) return OsErrors.DescontoMaiorQueTotal;

        Desconto = desconto;
        return Result.Success;
    }

    /// <summary>Registra pagamento parcial ou total. Atualiza PagamentoStatus.</summary>
    public void RegistrarPagamento(decimal valor)
    {
        TotalPago += valor;
        PagamentoStatus = TotalPago >= TotalGeral ? PagamentoStatus.Pago
            : TotalPago > 0 ? PagamentoStatus.Parcial
            : PagamentoStatus.Pendente;
    }
}
