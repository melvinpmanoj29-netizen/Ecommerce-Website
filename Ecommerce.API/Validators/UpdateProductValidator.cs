using Ecommerce.API.DTOs.Requests;
using FluentValidation;

namespace Ecommerce.API.Validators;

public class UpdateProductValidator
    : AbstractValidator<
        UpdateProductRequestDto>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0);
    }
}