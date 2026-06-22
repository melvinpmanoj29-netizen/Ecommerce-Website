using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;
using Ecommerce.API.Common;
using Ecommerce.API.Constants;

namespace Ecommerce.API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IEmailService _emailService;
    private readonly IUserRepository _userRepository;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IUserRepository userRepository,
        IEmailService emailService)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _userRepository = userRepository;
        _emailService = emailService;
    }

   public async Task CreateOrderAsync(int userId)
    {
        var cartItems =
            await _cartRepository.GetUserCartAsync(userId);

        if (!cartItems.Any())
        {
            throw new Exception("Cart is empty");
        }

        var order = new Order
        {
            UserId = userId,
            Status = OrderStatus.Pending,
            CreatedDate = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal total = 0;

        foreach (var item in cartItems)
        {
            if (item.Product == null)
            {
                throw new Exception(
                    $"Product data not found for product ID {item.ProductId}");
            }

            if (item.Product.Stock <= 0)
            {
                throw new Exception(
                    $"{item.Product.Name} is out of stock");
            }

            if (item.Quantity > item.Product.Stock)
            {
                throw new Exception(
                    $"Only {item.Product.Stock} units of {item.Product.Name} are available");
            }

            item.Product.Stock -= item.Quantity;

            order.OrderItems.Add(
                new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                });

            total += item.Product.Price * item.Quantity;

            _cartRepository.Delete(item);
        }

        order.TotalAmount = total;

        await _orderRepository.AddOrderAsync(order);

        try
        {
            await _orderRepository.SaveChangesAsync();

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user != null)
            {
                try
                {
                    var itemsHtml = string.Join(
                        "\n",
                        cartItems.Select(item =>
                            $"<tr><td style='padding: 10px; border-bottom: 1px solid #eee;'>{item.Product.Name}</td>" +
                            $"<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>{item.Quantity}</td>" +
                            $"<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>₹{item.Product.Price:F2}</td></tr>"
                        ));

                    var emailHtml = $"""
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
                            <div style="background-color: #000; padding: 25px; text-align: center;">
                                <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px;">ME10XLUXE</h1>
                            </div>

                            <div style="padding: 30px; background-color: #ffffff;">
                                <h2 style="color: #111; margin-top: 0; font-weight: 600;">
                                    Thank you for your order, {user.Name}!
                                </h2>

                                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                                    We've received your order <strong>#{order.Id}</strong>
                                    and are getting it ready for shipment.
                                </p>

                                <h3 style="margin-top: 35px; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: 600;">
                                    Order Summary
                                </h3>

                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                                    <thead>
                                        <tr style="background-color: #f8f8f8;">
                                            <th style="padding: 12px 10px; text-align: left;">Product</th>
                                            <th style="padding: 12px 10px; text-align: center;">Qty</th>
                                            <th style="padding: 12px 10px; text-align: right;">Price</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {itemsHtml}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: 600;">
                                                Total Amount:
                                            </td>

                                            <td style="padding: 15px 10px; text-align: right; font-weight: 700; font-size: 18px;">
                                                ₹{order.TotalAmount:F2}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #000; margin-top: 30px; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 16px;">
                                        <strong>Order Status:</strong>
                                        <span style="color: #2e7d32; font-weight: 600;">
                                            {order.Status}
                                        </span>
                                    </p>
                                </div>

                                <p style="margin-top: 40px; font-size: 14px; color: #777; text-align: center; line-height: 1.5;">
                                    If you have any questions about your order, please reply to this email or contact our support team.
                                </p>
                            </div>
                        </div>
                        """;

                    await _emailService.SendEmailAsync(
                        user.Email,
                        $"Order Confirmation - #{order.Id}",
                        emailHtml);
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine(
                        $"Failed to send confirmation email to {user.Email}: {emailEx.Message}");
                }
            }
        }
        catch (Exception ex)
        {
            var message = ex.Message;

            if (ex.InnerException != null)
            {
                message +=
                    " | INNER: " +
                    ex.InnerException.Message;
            }

            throw new Exception(message);
        }
    }
    public async Task<OrderResponseDto?>
    GetOrderByIdAsync(int id)
{
    var order =
        await _orderRepository.GetByIdAsync(id);

    if (order == null)
    {
        return null;
    }

    return new OrderResponseDto
    {
        Id = order.Id,
        TotalAmount = order.TotalAmount,
        Status = order.Status,
        CreatedDate = order.CreatedDate,
        DeliveredAt = order.DeliveredAt,
        RefundRequested = order.RefundRequested,
        DeliveryAgentId = order.DeliveryAgentId,
        DeliveryAgentName = order.DeliveryAgent?.Name,

        Items = order.OrderItems
            .Select(item =>
                new OrderItemResponseDto
                {
                    ProductName = item.Product.Name,
                    ImageUrl = item.Product.ImageUrl,
                    Quantity = item.Quantity,
                    Price = item.Price
                })
            .ToList()
    };
}

   public async Task<IEnumerable<OrderResponseDto>>
    GetOrdersAsync(int userId)
{
    var orders =
        await _orderRepository
            .GetUserOrdersAsync(userId);

    return orders.Select(order =>
        new OrderResponseDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedDate = order.CreatedDate,
            DeliveredAt = order.DeliveredAt,
            RefundRequested = order.RefundRequested,
            DeliveryAgentId = order.DeliveryAgentId,
            DeliveryAgentName = order.DeliveryAgent?.Name,

            Items = order.OrderItems
                .Select(item =>
                    new OrderItemResponseDto
                    {
                        ProductName = item.Product.Name,
                        ImageUrl = item.Product.ImageUrl,
                        Quantity = item.Quantity,
                        Price = item.Price
                    })
                .ToList()
        });
}

    public async Task<IEnumerable<OrderResponseDto>>
        GetAllOrdersAsync()
    {
        var orders =
            await _orderRepository
                .GetAllOrdersAsync();

        return orders.Select(order =>
            new OrderResponseDto
            {
                Id = order.Id,

                TotalAmount = order.TotalAmount,

                Status = order.Status,

                CreatedDate = order.CreatedDate,

                DeliveredAt = order.DeliveredAt,

                RefundRequested = order.RefundRequested,

                DeliveryAgentId = order.DeliveryAgentId,

                DeliveryAgentName = order.DeliveryAgent?.Name,

                Items = order.OrderItems
                    .Select(item =>
                        new OrderItemResponseDto
                        {
                            ProductName =
                                item.Product.Name,

                            ImageUrl =
                                item.Product.ImageUrl,

                            Quantity =
                                item.Quantity,

                            Price =
                                item.Price
                        })
                    .ToList()
            });
    }

    public async Task UpdateOrderStatusAsync(
    int id,
    string status)
    {
        var order =
            await _orderRepository
                .GetByIdAsync(id);

        if (order == null)
        {
            throw new Exception("Order not found");
        }
        if (order.Status == OrderStatus.Cancelled)
        {
            throw new Exception(
                "Cancelled orders cannot be updated");
        }

        if (order.Status == OrderStatus.Refunded)
        {
            throw new Exception(
                "Refunded orders cannot be updated");
        }

       var allowedTransitions =
    new Dictionary<string, List<string>>
        {
            {
                OrderStatus.Pending,
                new()
                {
                    OrderStatus.Processing,
                    OrderStatus.Cancelled
                }
            },

            {
                OrderStatus.Processing,
                new()
                {
                    OrderStatus.Shipped,
                    OrderStatus.Cancelled
                }
            },

            {
                OrderStatus.Shipped,
                new()
                {
                    OrderStatus.OutForDelivery
                }
            },

            {
                OrderStatus.OutForDelivery,
                new()
                {
                    OrderStatus.Delivered
                }
            },

            {
                OrderStatus.Delivered,
                new()
                {
                    OrderStatus.ReturnRequested
                }
            },

            {
                OrderStatus.ReturnRequested,
                new()
                {
                    OrderStatus.ReturnApproved,
                    OrderStatus.ReturnRejected
                }
            },

            {
                OrderStatus.ReturnApproved,
                new()
                {
                    OrderStatus.Refunded
                }
            }
        };
        if (!allowedTransitions.TryGetValue(order.Status,out var nextStatuses)|| !nextStatuses.Contains(status))
        {
            throw new Exception(
                $"Cannot change status from {order.Status} to {status}");
        }
        order.Status = status;  

        if (status == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTime.UtcNow;
        }
       else
        {
            order.DeliveredAt = null;   
        }

        _orderRepository.Update(order);

        await _orderRepository.SaveChangesAsync();
    }

    public async Task RequestReturnAsync(int orderId,int userId)
    {
        var order =
            await _orderRepository.GetByIdAsync(orderId);

        if (order == null)
        {
            throw new Exception("Order not found");
        }

        if (order.UserId != userId)
        {
            throw new Exception("Unauthorized");
        }

        if (order.Status != OrderStatus.Delivered)
        {
            throw new Exception(
                "Only delivered orders can be returned");
        }

        if (order.DeliveredAt == null)
        {
            throw new Exception(
                "Delivery date not found");
        }

        if (order.DeliveredAt.Value.AddDays(7)
            < DateTime.UtcNow)
        {
            throw new Exception(
                "Return window has expired");
        }

        order.Status = OrderStatus.ReturnRequested;

        order.ReturnRequestedAt = DateTime.UtcNow;

        order.RefundRequested = true;

        order.RefundAmount = order.TotalAmount;

        _orderRepository.Update(order);

        await _orderRepository.SaveChangesAsync();
    }
    public async Task CancelOrderAsync(int orderId,int userId)
    {
        var order =
            await _orderRepository.GetByIdAsync(orderId);

        if (order == null)
        {
            throw new Exception("Order not found");
        }

        if (order.UserId != userId)
        {
            throw new Exception("Unauthorized");
        }

        if (order.Status != OrderStatus.Pending &&
            order.Status != OrderStatus.Processing)
        {
            throw new Exception(
                "This order can no longer be cancelled");
        }

        order.Status = OrderStatus.Cancelled;

        _orderRepository.Update(order);

        await _orderRepository.SaveChangesAsync();
    }

    public async Task AssignDeliveryAgentAsync(
    int orderId,
    int deliveryAgentId)
    {
        var deliveryAgent =
            await _userRepository.GetByIdAsync(
                deliveryAgentId);

        if (deliveryAgent == null)
        {
            throw new Exception(
                "Delivery agent not found");
        }

        if (deliveryAgent.Role != Roles.DeliveryAgent)
        {
            throw new Exception(
                "Selected user is not a delivery agent");
        }

        await _orderRepository.AssignDeliveryAgentAsync(
            orderId,
            deliveryAgentId);

        await _orderRepository.SaveChangesAsync();
    }

    public async Task<IEnumerable<OrderResponseDto>>
        GetAssignedOrdersAsync(
            int deliveryAgentId)
    {
        var orders =
            await _orderRepository
                .GetAssignedOrdersAsync(
                    deliveryAgentId);

        return orders.Select(order =>
            new OrderResponseDto
            {
                Id = order.Id,

                TotalAmount = order.TotalAmount,

                Status = order.Status,

                CreatedDate = order.CreatedDate,

                DeliveredAt = order.DeliveredAt,

                RefundRequested =
                    order.RefundRequested,

                DeliveryAgentId =
                    order.DeliveryAgentId,

                DeliveryAgentName =
                    order.DeliveryAgent?.Name,

                Items = order.OrderItems
                    .Select(item =>
                        new OrderItemResponseDto
                        {
                            ProductName =
                                item.Product.Name,

                            ImageUrl =
                                item.Product.ImageUrl,

                            Quantity =
                                item.Quantity,

                            Price =
                                item.Price
                        })
                    .ToList()
            });
    }
}