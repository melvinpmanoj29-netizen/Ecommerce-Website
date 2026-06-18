using Ecommerce.API.Models;

namespace Ecommerce.API.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();

    Task<Product?> GetByIdAsync(int id);

    Task AddAsync(Product product);

    void Update(Product product);

    void Delete(Product product);

    Task SaveChangesAsync();

   Task<IEnumerable<Product>> SearchProductsAsync(
    string search,
    int pageNumber,
    int pageSize,
    int? categoryId,
    decimal? minPrice,
    decimal? maxPrice);
}