using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Repositories.Implementations;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>>
        GetAllAsync()
    {
        return await _context.Products
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<Product?>
        GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }

    public async Task AddAsync(
        Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public void Update(
        Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(
        Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Product>> SearchProductsAsync(
        string search,
        int pageNumber,
        int pageSize,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p =>
                    p.CategoryId == categoryId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p =>
                    p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p =>
                    p.Price <= maxPrice.Value);
            }

            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
}