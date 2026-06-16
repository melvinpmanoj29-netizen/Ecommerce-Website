namespace Ecommerce.API.DTOs.Requests;

public class CreateCategoryRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}