using System.Diagnostics;
using System.Net;
using System.Text.Json;
using FastEndpoints;
using Serilog;

namespace Wrench.Api.Middleware;

/// <summary>
/// Middleware de tratamento global de exceções.
///
/// Garante que TODA resposta de erro siga o formato RFC 7807 ProblemDetails
/// com traceId (correlation ID) para rastreamento. Categoriza:
///
/// - ValidationError (400): usuário errou input. Mensagem clara, sem jargão.
/// - NotFound (404): recurso não existe.
/// - Conflict (409): regra de negócio violada (ex: transição inválida).
/// - Unauthorized (401): não autenticado.
/// - ServerError (500): bug/infra. Mensagem genérica + traceId para o suporte.
///
/// O traceId é gerado por requisição e incluído no header X-Trace-Id
/// e no corpo do ProblemDetails para o suporte rastrear.
/// </summary>
public sealed class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public GlobalExceptionHandler(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = Activity.Current?.Id ?? context.TraceIdentifier;

        // Classifica o erro.
        var (status, title, detail, category) = exception switch
        {
            // Erros de validação do domínio (ErrorOr que vazou como exceção)
            ArgumentException => (
                HttpStatusCode.BadRequest,
                "Dados inválidos",
                exception.Message,
                "ValidationError"),

            UnauthorizedAccessException => (
                HttpStatusCode.Unauthorized,
                "Não autorizado",
                "Você precisa estar autenticado para acessar este recurso.",
                "Unauthorized"),

            // Erro não tratado = bug ou infra
            _ => (
                HttpStatusCode.InternalServerError,
                "Erro interno do servidor",
                "Ocorreu um erro inesperado. Nossa equipe já foi notificada.",
                "ServerError"),
        };

        // Log estruturado (não loga dados sensíveis — o Serilog não inclui
        // body/request automaticamente aqui).
        if (category == "ServerError")
        {
            Log.Error(exception,
                "ServerError {TraceId} {Method} {Path}: {ExceptionType}",
                traceId, context.Request.Method, context.Request.Path,
                exception.GetType().Name);
        }
        else
        {
            Log.Warning("{Category} {TraceId} {Method} {Path}: {Message}",
                category, traceId, context.Request.Method, context.Request.Path,
                exception.Message);
        }

        // Header de trace para o cliente/suporte.
        context.Response.Headers["X-Trace-Id"] = traceId;

        // ProblemDetails RFC 7807 padronizado.
        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/problem+json";

        var problem = new
        {
            type = $"https://httpstatuses.io/{(int)status}",
                    title,
                    status = (int)status,
                    detail,
                    traceId,
                    category,
                    timestamp = DateTimeOffset.UtcNow,
        };

        await JsonSerializer.SerializeAsync(context.Response.Body, problem, JsonOptions);
    }
}
