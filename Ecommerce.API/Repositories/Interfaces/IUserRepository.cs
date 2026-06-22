using Ecommerce.API.Models;

namespace Ecommerce.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    
    Task<IEnumerable<User>> GetAllAsync();

    Task<User?> GetByIdAsync(int id);

    Task AddAsync(User user);

    Task DeleteAsync(User user);

    Task UpdateRoleAsync( int id, string role);   

    Task SaveChangesAsync();
    
}