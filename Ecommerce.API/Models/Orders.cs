namespace Ecommerce.API.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public int? DeliveryAgentId { get; set; }

    public User? DeliveryAgent { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public ICollection<OrderItem> OrderItems{get;set; } = new List<OrderItem>();

    public ShippingAddress? ShippingAddress { get; set; }   

    public DateTime? DeliveredAt { get; set; }

    public DateTime? ReturnRequestedAt { get; set; }

    public bool RefundRequested { get; set; }

    public decimal? RefundAmount { get; set; }

    public string? DeliveryOtp { get; set; }

    public DateTime? DeliveryOtpExpiresAt { get; set; }

    public int DeliveryOtpAttempts { get; set; }

    public DateTime? DeliveryOtpRequestedAt { get; set; }

    public bool EmergencyOtpRequested { get; set; }

    public bool EmergencyOtpApproved { get; set; }

    public DateTime? EmergencyOtpRequestedAt { get; set; }

    public string? EmergencyOtpReason { get; set; }

}