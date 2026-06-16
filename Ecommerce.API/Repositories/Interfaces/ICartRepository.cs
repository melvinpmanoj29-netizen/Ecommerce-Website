using Ecommerce.API.Models;

namespace Ecommerce.API.Repositories.Interfaces;

public interface ICartRepository
{
    Task<IEnumerable<CartItem>>
        GetUserCartAsync(int userId);

    Task<CartItem?>
        GetCartItemAsync(
            int userId,
            int productId);

    Task<CartItem?>
        GetByIdAsync(int id);

    Task AddAsync(
        CartItem cartItem);

    void Update(
        CartItem cartItem);

    void Delete(
        CartItem cartItem);

    Task SaveChangesAsync();
}   