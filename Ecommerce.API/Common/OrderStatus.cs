namespace Ecommerce.API.Common;

public static class OrderStatus
{
    public const string Pending = "Pending";

    public const string Processing = "Processing";

    public const string Shipped = "Shipped";

    public const string OutForDelivery = "OutForDelivery";

    public const string Delivered = "Delivered";

    public const string Cancelled = "Cancelled";

    public const string ReturnRequested = "ReturnRequested";

    public const string ReturnApproved = "ReturnApproved";

    public const string ReturnRejected = "ReturnRejected";

    public const string Refunded = "Refunded";
}