namespace Ecommerce.API.DTOs.Requests;

public class AddToCartRequestDto
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}