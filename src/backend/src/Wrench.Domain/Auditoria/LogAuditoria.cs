using Wrench.Domain.Common;

namespace Wrench.Domain.Auditoria;

/// <summary>
/// Log de auditoria LGPD (Art. 37). Registra quem fez o quê, quando.
///
/// CRÍTICO: NUNCA armazenar dados sensíveis aqui (CPF, placa, email).
/// Apenas IDs e tipos de operação. O payload é opcional e só contém
/// metadados não-sensíveis (ex: numero da OS, codigo da peca).
/// </summary>
public sealed class LogAuditoria : Entity
{
    /// <summary>UserId que executou a ação (do JWT).</summary>
    public Guid? UserId { get; private set; }

    /// <summary>Tenant dono da ação.</summary>
    public Guid TenantIdAudit { get; private set; }

    /// <summary>Tipo de ação (Create, Update, Delete, Login, View).</summary>
    public string Acao { get; private set; } = default!;

    /// <summary>Entidade afetada (ex: "OrdemServico", "Peca").</summary>
    public string Entidade { get; private set; } = default!;

    /// <summary>ID da entidade afetada (Guid).</summary>
    public Guid? EntidadeId { get; private set; }

    /// <summary>Endpoint HTTP (ex: POST /api/ordens-servico).</summary>
    public string? Endpoint { get; private set; }

    /// <summary>Metadados não-sensíveis (ex: numero da OS). NUNCA dados pessoais.</summary>
    public string? Detalhes { get; private set; }

    /// <summary>Endereço IP de origem (para investigação de incidentes).</summary>
    public string? IpOrigem { get; private set; }

    public DateTimeOffset DataHora { get; private set; }

    private LogAuditoria() { }

    /// <summary>
    /// Factory — cria um log de auditoria. Valida que detalhes não contêm
    /// dados sensíveis (heurística simples: bloqueia CPF/CNPJ).
    /// </summary>
    public static LogAuditoria Registrar(
        Guid? userId,
        Guid tenantId,
        string acao,
        string entidade,
        Guid? entidadeId = null,
        string? endpoint = null,
        string? detalhes = null,
        string? ipOrigem = null)
    {
        // Sanitiza detalhes — remove possíveis dados sensíveis.
        var detalhesSanitizados = SanitizarDetalhes(detalhes);

        return new LogAuditoria
        {
            Id = Guid.CreateVersion7(),
            UserId = userId,
            TenantIdAudit = tenantId,
            Acao = acao,
            Entidade = entidade,
            EntidadeId = entidadeId,
            Endpoint = endpoint,
            Detalhes = detalhesSanitizados,
            IpOrigem = ipOrigem,
            DataHora = DateTimeOffset.UtcNow,
        };
    }

    /// <summary>
    /// Heurística simples de sanitização: mascara CPF (xxx.xxx.xxx-xx)
    /// e CNPJ (xx.xxx.xxx/xxxx-xx) se aparecerem nos detalhes.
    /// </summary>
    private static string? SanitizarDetalhes(string? detalhes)
    {
        if (string.IsNullOrWhiteSpace(detalhes)) return null;

        // Mascara CPF: 000.000.000-00 → ***.***.***-**
        var sanitized = System.Text.RegularExpressions.Regex.Replace(
            detalhes,
            @"\d{3}\.\d{3}\.\d{3}-\d{2}",
            "***.***.***-**");

        // Mascara CNPJ: 00.000.000/0000-00 → **.***.***/****-**
        sanitized = System.Text.RegularExpressions.Regex.Replace(
            sanitized,
            @"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}",
            "**.***.***/****-**");

        return sanitized;
    }
}
