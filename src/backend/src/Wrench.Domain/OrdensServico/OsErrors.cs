using ErrorOr;

namespace Wrench.Domain.OrdensServico;

/// <summary>Erros de domínio de Ordem de Serviço (padrão ErrorOr).</summary>
public static class OsErrors
{
    public static Error ClienteObrigatorio =>
        Error.Validation("OrdemServico.ClienteObrigatorio", "Cliente é obrigatório.");

    public static Error ClienteNomeObrigatorio =>
        Error.Validation("OrdemServico.ClienteNomeObrigatorio", "Nome do cliente é obrigatório.");

    public static Error VeiculoPlacaObrigatoria =>
        Error.Validation("OrdemServico.VeiculoPlacaObrigatoria", "Placa do veículo é obrigatória.");

    public static Error VeiculoModeloObrigatorio =>
        Error.Validation("OrdemServico.VeiculoModeloObrigatorio", "Modelo do veículo é obrigatório.");

    public static Error ItemPecaIdObrigatorio =>
        Error.Validation("OrdemServico.ItemPecaIdObrigatorio", "ID da peça é obrigatório.");

    public static Error ItemServicoIdObrigatorio =>
        Error.Validation("OrdemServico.ItemServicoIdObrigatorio", "ID do serviço é obrigatório.");

    public static Error ItemNomeObrigatorio =>
        Error.Validation("OrdemServico.ItemNomeObrigatorio", "Nome do item é obrigatório.");

    public static Error ItemQuantidadeInvalida =>
        Error.Validation("OrdemServico.ItemQuantidadeInvalida", "Quantidade deve ser maior que zero.");

    public static Error ItemPrecoInvalido =>
        Error.Validation("OrdemServico.ItemPrecoInvalido", "Preço unitário não pode ser negativo.");

    public static Error ItemMaoDeObraInvalida =>
        Error.Validation("OrdemServico.ItemMaoDeObraInvalida", "Mão de obra não pode ser negativa.");

    public static Error TransicaoInvalida(string atual, string destino) =>
        Error.Conflict(
            "OrdemServico.TransicaoInvalida",
            $"Transição de status inválida: {atual} → {destino}.");

    public static Error DescontoInvalido =>
        Error.Validation("OrdemServico.DescontoInvalido", "Desconto não pode ser negativo.");

    public static Error DescontoMaiorQueTotal =>
        Error.Validation("OrdemServico.DescontoMaiorQueTotal", "Desconto não pode exceder o total da OS.");

    public static Error NaoEncontrada(Guid id) =>
        Error.NotFound("OrdemServico.NaoEncontrada", $"Ordem de Serviço {id} não encontrada.");
}
