using ErrorOr;
using FluentValidation;
using MediatR;

namespace Wrench.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior que roda todos IValidator<TRequest> antes do handler.
/// Se falhas, retorna os erros sem chamar o handler (curto-circuito).
/// </summary>
public sealed class ValidationBehavior<TRequest, TResponse> :
    IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : IErrorOr
{
    private readonly IValidator<TRequest>? _validator;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        // Pega o primeiro validator registrado para este request (se houver).
        _validator = validators.FirstOrDefault();
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (_validator is null) return await next();

        var result = await _validator.ValidateAsync(request, ct);
        if (result.IsValid) return await next();

        var errors = result.Errors
            .ConvertAll(e => Error.Validation(
                code: e.PropertyName,
                description: e.ErrorMessage));

        // Cast dinâmico: List<Error> → ErrorOr<TResponse> (explora a conversão
        // implícita do ErrorOr quando TResponse é ErrorOr<T>).
        return (dynamic)errors;
    }
}
