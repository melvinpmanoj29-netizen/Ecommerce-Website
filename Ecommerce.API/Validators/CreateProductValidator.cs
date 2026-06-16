using Ecommerce.API.DTOs.Requests;
using FluentValidation;

namespace Ecommerce.API.Validators;

public class CreateProductValidator
    : AbstractValidator<
        CreateProductRequestDto>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);
    }
}