using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Repositories.Implementations;

public class OrderRepository
    : IOrderRepository
{
    private readonly ApplicationDbContext
        _context;

    public OrderRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddOrderAsync(
        Order order)
    {
        await _context.Orders
            .AddAsync(order);
    }

    public async Task<IEnumerable<Order>>
        GetUserOrdersAsync(int userId)
    {
       return await _context.Orders
        .Include(x => x.DeliveryAgent)
        .Include(x => x.OrderItems)
        .ThenInclude(x => x.Product)
        .Where(x => x.UserId == userId)
        .ToListAsync();
    }

    public async Task<Order?>
        GetByIdAsync(int id)
    {
        return await _context.Orders
        .Include(x => x.DeliveryAgent)
        .Include(x => x.OrderItems)
        .ThenInclude(x => x.Product)
        .FirstOrDefaultAsync(x => x.Id == id);
    }
    public async Task<IEnumerable<Order>>
    GetAllOrdersAsync()
    {
       return await _context.Orders
        .Include(x => x.DeliveryAgent)
        .Include(x => x.OrderItems)
        .ThenInclude(x => x.Product)
        .ToListAsync();
    }   
    public async Task
        UpdateOrderStatusAsync(
            int id,
            string status)
    {
        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    x => x.Id == id);

        if (order == null)
        {
            throw new Exception(
                "Order not found");
        }

        order.Status = status;
    }

    public async Task<IEnumerable<Order>>
    GetAssignedOrdersAsync(int deliveryAgentId)
        {
            return await _context.Orders
                .Include(x => x.DeliveryAgent)
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
                .Where(x => x.DeliveryAgentId == deliveryAgentId)
                .ToListAsync();
        }

    public async Task AssignDeliveryAgentAsync(
        int orderId,
        int deliveryAgentId)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            order.DeliveryAgentId = deliveryAgentId;
        }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}