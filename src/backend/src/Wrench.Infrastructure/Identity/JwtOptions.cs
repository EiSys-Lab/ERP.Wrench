namespace Wrench.Infrastructure.Identity;

/// <summary>Configuração de JWT (appsettings seção Jwt).</summary>
public sealed class JwtOptions
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "wrench-oficina";
    public string Audience { get; set; } = "wrench-oficina";
    public int ExpiryMinutes { get; set; } = 480;

    public bool IsValid => Secret.Length >= 32;
}
