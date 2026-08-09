using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Wrench.Application.Common.Security;
using Wrench.Domain.Identity;
using Wrench.Infrastructure.Persistence;

namespace Wrench.Api.Endpoints.Identity;

/// <summary>
/// Endpoint de login — valida email/senha, gera JWT.
/// Cross-tenant (busca user por email em qualquer tenant).
/// </summary>
public sealed class LoginEndpoint : Endpoint<LoginRequest, LoginResponse>
{
    private readonly WrenchDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _jwt;

    public LoginEndpoint(WrenchDbContext db, IPasswordHasher hasher, IJwtTokenGenerator jwt)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwt;
    }

    public override void Configure()
    {
        Post("/api/identity/login");
        AllowAnonymous();
        Description(b => b
            .Produces<LoginResponse>(200)
            .ProducesProblem(401)
            .WithTags("Identity"));
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLowerInvariant(), ct);

        if (user is null || !user.Ativo || !_hasher.Verify(req.Password, user.PasswordHash))
        {
            ThrowError("Email ou senha inválidos", StatusCodes.Status401Unauthorized);
            return;
        }

        user.RegistrarAcesso();
        await _db.SaveChangesAsync(ct);

        var roles = user.Roles.Select(r => r.Nome).ToList();
        if (roles.Count == 0) roles.Add("Administrador");

        var token = _jwt.Generate(user.Id, user.TenantId, user.Email, user.Nome, roles);

        await SendAsync(new LoginResponse(
            token.Token,
            token.ExpiresAt.ToString("O"),
            new LoginUser(user.Id.ToString(), user.Email, user.Nome, user.TenantId.ToString())),
            cancellation: ct);
    }
}

public sealed record LoginRequest(string Email, string Password);

public sealed record LoginResponse(string Token, string ExpiresAt, LoginUser User);

public sealed record LoginUser(string UserId, string Email, string Nome, string TenantId);
