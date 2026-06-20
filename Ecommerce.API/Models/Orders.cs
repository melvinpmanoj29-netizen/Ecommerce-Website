namespace Ecommerce.API.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public ICollection<OrderItem> OrderItems{get;set; } = new List<OrderItem>();

    public DateTime? DeliveredAt { get; set; }

    public DateTime? ReturnRequestedAt { get; set; }

    public bool RefundRequested { get; set; }

    public decimal? RefundAmount { get; set; }
}