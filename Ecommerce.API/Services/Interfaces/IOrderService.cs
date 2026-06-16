using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IOrderService
{
    Task CreateOrderAsync(
        int userId);

    Task<IEnumerable<OrderResponseDto>>
        GetOrdersAsync(
            int userId);
    Task<IEnumerable<OrderResponseDto>>
        GetAllOrdersAsync();

    Task<OrderResponseDto?>
        GetOrderByIdAsync(
            int id);
    Task UpdateOrderStatusAsync(
    int id,
    string status);
}   