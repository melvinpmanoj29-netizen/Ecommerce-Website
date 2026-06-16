using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IReviewService
{
    Task CreateReviewAsync(
        int userId,
        CreateReviewRequestDto dto);

    Task<IEnumerable<ReviewResponseDto>>
        GetProductReviewsAsync(
            int productId);
}