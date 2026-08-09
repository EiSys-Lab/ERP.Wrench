using System.Diagnostics;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Wrench.Application.Common.Tenancy;
using Wrench.Domain.Auditoria;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Middleware;

/// <summary>
/// Middleware de auditoria LGPD (Art. 37).
///
/// Registra automaticamente operações de escrita (POST/PUT/PATCH/DELETE)
/// com: userId, tenantId, endpoint, IP de origem, e resultado (sucesso/erro).
///
/// NÃO loga body/request (pode conter dados sensíveis). Apenas metadados.
/// </summary>
public sealed class AuditoriaMiddleware
{
    private readonly RequestDelegate _next;

    private static readonly HashSet<string> MetodosAuditados = new(StringComparer.OrdinalIgnoreCase)
    {
        "POST", "PUT", "PATCH", "DELETE",
    };

    public AuditoriaMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(
        HttpContext context,
        ITenantContext tenantContext,
        WrenchDbContext db)
    {
        // Só audita métodos de escrita.
        if (!MetodosAuditados.Contains(context.Request.Method))
        {
            await _next(context);
            return;
        }

        // Pula health checks e swagger.
        var path = context.Request.Path.Value ?? "";
        if (path.Contains("/health") || path.Contains("/swagger"))
        {
            await _next(context);
            return;
        }

        await _next(context);

        // Após executar, registra no log se foi sucesso (2xx).
        var status = context.Response.StatusCode;
        if (status is < 200 or > 299) return; // não audita falhas (o GlobalExceptionHandler já loga)

        try
        {
            var tenantId = tenantContext.TenantId ?? Guid.Empty;
            var userId = tenantContext.UserId;
            var ip = context.Connection.RemoteIpAddress?.ToString();

            // Determina entidade a partir do path (heurística).
            var (entidade, entidadeId) = ResolverEntidade(path);

            var log = LogAuditoria.Registrar(
                userId: userId,
                tenantId: tenantId,
                acao: MapAcao(context.Request.Method),
                entidade: entidade,
                entidadeId: entidadeId,
                endpoint: $"{context.Request.Method} {path}",
                ipOrigem: ip);

            db.LogsAuditoria.Add(log);
            await db.SaveChangesAsync(context.RequestAborted);
        }
        catch (Exception ex)
        {
            // Fail soft: auditoria não pode travar a requisição.
            Log.Warning(ex, "AuditoriaMiddleware: falha ao registrar log de auditoria");
        }
    }

    /// <summary>Extrai entidade e ID do path (heurística: /api/ordens-servico/123).</summary>
    private static (string entidade, Guid? entidadeId) ResolverEntidade(string path)
    {
        var segmentos = path.Split('/', StringSplitOptions.RemoveEmptyEntries);

        // /api/{entidade-plural}/{id?}
        if (segmentos.Length >= 2)
        {
            var entidadePlural = segmentos[1]; // "ordens-servico", "pecas", etc
            var entidade = entidadePlural switch
            {
                "ordens-servico" => "OrdemServico",
                "pecas" => "Peca",
                "servicos" => "Servico",
                "clientes" => "Cliente",
                _ => entidadePlural,
            };

            Guid? id = null;
            if (segmentos.Length >= 3 && Guid.TryParse(segmentos[2], out var guid))
                id = guid;

            return (entidade, id);
        }

        return ("Desconhecida", null);
    }

    private static string MapAcao(string method) => method.ToUpperInvariant() switch
    {
        "POST" => "Create",
        "PUT" or "PATCH" => "Update",
        "DELETE" => "Delete",
        _ => "Other",
    };
}
