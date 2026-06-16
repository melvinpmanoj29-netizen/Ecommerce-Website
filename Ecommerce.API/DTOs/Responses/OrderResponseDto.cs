namespace Ecommerce.API.DTOs.Responses;

public class OrderResponseDto
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }
        = string.Empty;

    public DateTime CreatedDate { get; set; }

    public List<OrderItemResponseDto>
        Items { get; set; }
            = new();
}