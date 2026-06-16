namespace Ecommerce.API.DTOs.Responses;

public class OrderItemResponseDto
{
    public string ProductName { get; set; }
        = string.Empty;

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public string ImageUrl { get; set; }
    = string.Empty; 
}   