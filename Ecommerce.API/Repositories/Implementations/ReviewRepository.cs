using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Repositories.Implementations;

public class ReviewRepository
    : IReviewRepository
{
    private readonly ApplicationDbContext
        _context;

    public ReviewRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        Review review)
    {
        await _context.Reviews
            .AddAsync(review);
    }

    public async Task<IEnumerable<Review>>
        GetProductReviewsAsync(
            int productId)
    {
        return await _context.Reviews
            .Include(x => x.User)
            .Where(x =>
                x.ProductId == productId)
            .OrderByDescending(x =>
                x.CreatedDate)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}