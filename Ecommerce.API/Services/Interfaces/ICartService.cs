using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface ICartService
{
    Task AddToCartAsync(
        int userId,
        AddToCartRequestDto dto);

    Task<IEnumerable<CartResponseDto>>
        GetCartAsync(int userId);

    Task UpdateCartAsync(
        int userId,
        UpdateCartRequestDto dto);

    Task RemoveFromCartAsync(
        int userId,
        int cartItemId);
}