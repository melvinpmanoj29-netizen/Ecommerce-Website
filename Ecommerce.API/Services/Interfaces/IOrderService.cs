using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IOrderService
{
    Task CreateOrderAsync(int userId);

    Task<IEnumerable<OrderResponseDto>> GetOrdersAsync(int userId);

    Task<OrderResponseDto?> GetOrderByIdAsync(int id);

    Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync();

    Task UpdateOrderStatusAsync(int id,string status);

    Task RequestReturnAsync(int orderId,int userId);

    Task CancelOrderAsync(int orderId,int userId);

    Task AssignDeliveryAgentAsync(int orderId,int deliveryAgentId);

    Task<IEnumerable<OrderResponseDto>> GetAssignedOrdersAsync(int deliveryAgentId);

    Task StartDeliveryAsync(int orderId, int deliveryAgentId);

    Task RequestDeliveryOtpAsync(int orderId, int deliveryAgentId);

    Task VerifyDeliveryOtpAsync(int orderId, int deliveryAgentId, string otp);

    Task RequestEmergencyOtpAsync(int orderId, int deliveryAgentId, string reason);

    Task ApproveEmergencyOtpAsync(int orderId);

    Task<IEnumerable<Ecommerce.API.DTOs.Responses.EmergencyDeliveryResponseDto>> GetEmergencyDeliveriesAsync();
}