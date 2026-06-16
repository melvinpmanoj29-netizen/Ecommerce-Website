using Ecommerce.API.Models;

namespace Ecommerce.API.Repositories.Interfaces;

public interface IReviewRepository
{
    Task AddAsync(
        Review review);

    Task<IEnumerable<Review>>
        GetProductReviewsAsync(
            int productId);

    Task SaveChangesAsync();
}