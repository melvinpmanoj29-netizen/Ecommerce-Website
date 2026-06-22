namespace Ecommerce.API.DTOs.Responses;

public class EmergencyDeliveryResponseDto
{
    public int OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string DeliveryAgentName { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public DateTime? RequestTimestamp { get; set; }
    public string RequestReason { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
}
