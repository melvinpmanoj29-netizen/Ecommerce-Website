namespace Ecommerce.API.DTOs.Requests;

public class UpdateCartRequestDto
{
    public int CartItemId { get; set; }

    public int Quantity { get; set; }
}