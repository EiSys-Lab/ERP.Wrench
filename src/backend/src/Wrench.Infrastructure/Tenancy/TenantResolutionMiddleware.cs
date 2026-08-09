using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Wrench.Application.Common.Tenancy;

namespace Wrench.Infrastructure.Tenancy;

/// <summary>
/// Middleware que resolve o tenant da requisição.
/// Em dev: lê header X-Tenant-Id. Em produção: lê claim JWT tenant_id + sub.
/// JWT sobrepõe header. Popula o ITenantContext (Scoped).
/// </summary>
public sealed class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(
        HttpContext context,
        ITenantContext tenantContext)
    {
        Guid? tenantId = null;
        Guid? userId = null;

        // Header X-Tenant-Id (dev)
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var headerTenant)
            && Guid.TryParse(headerTenant, out var headerGuid))
        {
            tenantId = headerGuid;
        }

        // Claims JWT sobrepõem header
        var user = context.User;
        if (user.Identity?.IsAuthenticated == true)
        {
            var tenantClaim = user.FindFirst("tenant_id")?.Value;
            if (tenantClaim is not null && Guid.TryParse(tenantClaim, out var jwtTenant))
                tenantId = jwtTenant;

            var subClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? user.FindFirst("sub")?.Value;
            if (subClaim is not null && Guid.TryParse(subClaim, out var jwtUser))
                userId = jwtUser;
        }

        tenantContext.SetContext(tenantId, null, userId);

        await _next(context);
    }
}
