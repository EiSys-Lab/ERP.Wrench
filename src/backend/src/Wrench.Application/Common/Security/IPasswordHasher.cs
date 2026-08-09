namespace Wrench.Application.Common.Security;

/// <summary>Hash de senha (implementação BCrypt na Infrastructure).</summary>
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

/// <summary>Gerador de token JWT.</summary>
public interface IJwtTokenGenerator
{
    TokenResult Generate(Guid userId, Guid tenantId, string email, string name, IEnumerable<string> roles);
}

/// <summary>Saída do gerador de token.</summary>
public record TokenResult(string Token, DateTimeOffset ExpiresAt);
