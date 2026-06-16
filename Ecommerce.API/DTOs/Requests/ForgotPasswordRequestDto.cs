using System.ComponentModel.DataAnnotations;

namespace Ecommerce.API.DTOs.Requests;

public class ForgotPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
