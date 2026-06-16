using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Repositories.Implementations;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _context;

    public CartRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CartItem>>
        GetUserCartAsync(int userId)
    {
        return await _context.CartItems
            .Include(x => x.Product)
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<CartItem?>
        GetCartItemAsync(
            int userId,
            int productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(
                x =>
                    x.UserId == userId &&
                    x.ProductId == productId);
    }

    public async Task<CartItem?>
        GetByIdAsync(int id)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }

    public async Task AddAsync(
        CartItem cartItem)
    {
        await _context.CartItems
            .AddAsync(cartItem);
    }

    public void Update(
        CartItem cartItem)
    {
        _context.CartItems
            .Update(cartItem);
    }

    public void Delete(
        CartItem cartItem)
    {
        _context.CartItems
            .Remove(cartItem);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}