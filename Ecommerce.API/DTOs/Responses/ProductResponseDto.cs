namespace Ecommerce.API.DTOs.Responses;

public class ProductResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal CostPrice { get; set; }

    public int Stock { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string CategoryName{ get; set;}

     public int CategoryId{ get; set; }
}