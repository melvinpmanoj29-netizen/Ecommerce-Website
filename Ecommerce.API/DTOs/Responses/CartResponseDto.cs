namespace Ecommerce.API.DTOs.Responses;

public class CartResponseDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public decimal SubTotal { get; set; }

    public string ImageUrl { get; set; } = string.Empty;    
}