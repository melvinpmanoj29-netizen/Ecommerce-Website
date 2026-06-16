using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class ReviewService
    : IReviewService
{
    private readonly IReviewRepository
        _reviewRepository;

    public ReviewService(
        IReviewRepository reviewRepository)
    {
        _reviewRepository =
            reviewRepository;
    }

    public async Task CreateReviewAsync(
        int userId,
        CreateReviewRequestDto dto)
    {
        var review = new Review
        {
            ProductId =
                dto.ProductId,

            UserId =
                userId,

            Rating =
                dto.Rating,

            Comment =
                dto.Comment,

            CreatedDate =
                DateTime.UtcNow
        };

        await _reviewRepository
            .AddAsync(review);

        await _reviewRepository
            .SaveChangesAsync();
    }

    public async Task<IEnumerable<ReviewResponseDto>>
        GetProductReviewsAsync(
            int productId)
    {
        var reviews =
            await _reviewRepository
                .GetProductReviewsAsync(
                    productId);

        return reviews.Select(
            x => new ReviewResponseDto
            {
                Id = x.Id,

                UserName =
                    x.User.Name,

                Rating =
                    x.Rating,

                Comment =
                    x.Comment,

                CreatedDate =
                    x.CreatedDate
            });
    }
}