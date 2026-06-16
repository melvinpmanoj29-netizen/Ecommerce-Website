using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(
        ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task AddToCartAsync(
        int userId,
        AddToCartRequestDto dto)
    {
        var existingCartItem =
            await _cartRepository
                .GetCartItemAsync(
                    userId,
                    dto.ProductId);

        if (existingCartItem != null)
        {
            existingCartItem.Quantity += dto.Quantity;

            _cartRepository
                .Update(existingCartItem);
        }
        else
        {
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };

            await _cartRepository
                .AddAsync(cartItem);
        }

        await _cartRepository
            .SaveChangesAsync();
    }

    public async Task<
        IEnumerable<CartResponseDto>>
        GetCartAsync(int userId)
    {
        var cartItems =
            await _cartRepository
                .GetUserCartAsync(userId);

        return cartItems.Select(x =>
            new CartResponseDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ProductName = x.Product.Name,
                Price = x.Product.Price,
                Quantity = x.Quantity,
                SubTotal = x.Product.Price *  x.Quantity,
                ImageUrl = x.Product.ImageUrl,
            });
    }

    public async Task UpdateCartAsync(
        int userId,
        UpdateCartRequestDto dto)
    {
        var cartItem =
            await _cartRepository
                .GetByIdAsync(
                    dto.CartItemId);

        if (cartItem == null)
        {
            throw new Exception(
                "Cart item not found");
        }

        if (cartItem.UserId != userId)
        {
            throw new Exception(
                "Unauthorized");
        }

        cartItem.Quantity =
            dto.Quantity;

        _cartRepository
            .Update(cartItem);

        await _cartRepository
            .SaveChangesAsync();
    }

    public async Task RemoveFromCartAsync(
        int userId,
        int cartItemId)
    {
        var cartItem =
            await _cartRepository
                .GetByIdAsync(
                    cartItemId);

        if (cartItem == null)
        {
            throw new Exception(
                "Cart item not found");
        }

        if (cartItem.UserId != userId)
        {
            throw new Exception(
                "Unauthorized");
        }

        _cartRepository
            .Delete(cartItem);

        await _cartRepository
            .SaveChangesAsync();
    }
}
