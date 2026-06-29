namespace Ecommerce.API.DTOs.Responses;

public class OrderResponseDto
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }
        = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public bool RefundRequested { get; set; }

    public int? DeliveryAgentId { get; set; }

    public string? DeliveryAgentName { get; set; }

    public ShippingAddressResponseDto? ShippingAddress { get; set; }

    public List<OrderItemResponseDto> Items { get; set; } = new();
}