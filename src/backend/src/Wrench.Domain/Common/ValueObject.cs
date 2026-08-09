namespace Wrench.Domain.Common;

/// <summary>
/// Base para Value Objects — igualdade estrutural (por valor, não por Id).
///
/// No C# moderno, prefira `record` ou `readonly record struct` para VOs
/// simples. Esta classe abstrata fica para VOs com comportamento.
/// </summary>
public abstract class ValueObject : IEquatable<ValueObject>
{
    /// <summary>Componentes usados na comparação estrutural.</summary>
    protected abstract IEnumerable<object?> GetEqualityComponents();

    public bool Equals(ValueObject? other)
    {
        if (other is null || other.GetType() != GetType()) return false;
        return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    }

    public override bool Equals(object? obj) => obj is ValueObject vo && Equals(vo);

    public override int GetHashCode() =>
        GetEqualityComponents()
            .Aggregate(0, (hash, obj) => hash ^ (obj?.GetHashCode() ?? 0));

    public static bool operator ==(ValueObject? a, ValueObject? b) => Equals(a, b);
    public static bool operator !=(ValueObject? a, ValueObject? b) => !Equals(a, b);
}
