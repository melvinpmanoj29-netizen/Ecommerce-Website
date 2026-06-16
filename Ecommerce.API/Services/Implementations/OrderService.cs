using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

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
            await _cartRepository
                .GetUserCartAsync(userId);

        if (!cartItems.Any())
        {
            throw new Exception("Cart is empty");
        }

        var order = new Order
        {
            UserId = userId,
            Status = "Pending",
            CreatedDate = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal total = 0;

        foreach (var item in cartItems)
        {
            order.OrderItems.Add(
                new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                });

            total += item.Product.Price * item.Quantity;
        }

        order.TotalAmount = total;

        await _orderRepository.AddOrderAsync(order);

        foreach (var item in cartItems)
        {
            _cartRepository.Delete(item);
        }

        try
        {
            await _orderRepository.SaveChangesAsync();

            var user =
                await _userRepository
                    .GetByIdAsync(userId);

            if (user != null)
            {
                try
                {
                    var itemsHtml = string.Join("\n", cartItems.Select(item => 
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
                                <h2 style="color: #111; margin-top: 0; font-weight: 600;">Thank you for your order, {user.Name}!</h2>
                                <p style="font-size: 16px; color: #555; line-height: 1.5;">We're excited to let you know that we've received your order <strong>#{order.Id}</strong> and are getting it ready for shipment.</p>
                                
                                <h3 style="margin-top: 35px; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: 600;">Order Summary</h3>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                                    <thead>
                                        <tr style="background-color: #f8f8f8;">
                                            <th style="padding: 12px 10px; text-align: left; color: #444; font-weight: 600;">Product</th>
                                            <th style="padding: 12px 10px; text-align: center; color: #444; font-weight: 600;">Qty</th>
                                            <th style="padding: 12px 10px; text-align: right; color: #444; font-weight: 600;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsHtml}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: 600; color: #111;">Total Amount:</td>
                                            <td style="padding: 15px 10px; text-align: right; font-weight: 700; font-size: 18px; color: #000;">₹{order.TotalAmount:F2}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #000; margin-top: 30px; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 16px;"><strong>Order Status:</strong> <span style="color: #2e7d32; font-weight: 600;">{order.Status}</span></p>
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
                    // Log the error but don't fail the order checkout
                    Console.WriteLine($"Failed to send confirmation email to {user.Email}: {emailEx.Message}");
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

    public async Task<OrderResponseDto?>
        GetOrderByIdAsync(int id)
    {
        var order =
            await _orderRepository
                .GetByIdAsync(id);

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
        };
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
        await _orderRepository
            .UpdateOrderStatusAsync(id, status);

        await _orderRepository
            .SaveChangesAsync();
    }
}