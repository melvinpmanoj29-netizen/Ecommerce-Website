using Ecommerce.API.Models;

namespace Ecommerce.API.Repositories.Interfaces;

public interface IOrderRepository
{
    Task AddOrderAsync(Order order);

    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<Order?> GetByIdAsync(int id);
    Task UpdateOrderStatusAsync(int id,string status);
    Task<IEnumerable<Order>> GetAssignedOrdersAsync(int deliveryAgentId);

Task AssignDeliveryAgentAsync(int orderId,int deliveryAgentId);

    void Update(Order order);

    Task SaveChangesAsync();
}