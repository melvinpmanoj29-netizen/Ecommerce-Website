using Ecommerce.API.DTOs.Requests;
using FluentValidation;

namespace Ecommerce.API.Validators;

public class CreateCategoryValidator
    : AbstractValidator<
        CreateCategoryRequestDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);
    }
}