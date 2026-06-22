using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

    public async Task AddToCartAsync( int userId, AddToCartRequestDto dto )
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
            {
                throw new Exception("Product not found");
            }

            if (product.Stock <= 0)
            {
                throw new Exception("This product is out of stock");
            }
            
            var existingCartItem =
                await _cartRepository
                    .GetCartItemAsync(
                        userId,
                        dto.ProductId);

            if (existingCartItem != null)
                {
                    var newQuantity = existingCartItem.Quantity + dto.Quantity;

                    if (newQuantity > product.Stock)
                    {
                        throw new Exception(
                            $"Only {product.Stock} items available");
                    }

                    existingCartItem.Quantity = newQuantity;
                                _cartRepository
                        .Update(existingCartItem);

                    if (dto.Quantity > product.Stock)
                    {
                        throw new Exception(
                            $"Only {product.Stock} items available");
                    }
                }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };

                await _cartRepository.AddAsync(cartItem);
            }

            await _cartRepository.SaveChangesAsync();
        }

    public async Task<IEnumerable<CartResponseDto>> GetCartAsync(int userId)
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
                    Stock = x.Product.Stock,
                });
        }

    public async Task UpdateCartAsync( int userId,UpdateCartRequestDto dto)
        {
            var cartItem =
                await _cartRepository.GetByIdAsync(dto.CartItemId);

            if (cartItem == null)
            {
                throw new Exception("Cart item not found");
            }

            if (cartItem.UserId != userId)
            {
                throw new Exception("Unauthorized");
            }

            if (dto.Quantity > cartItem.Product.Stock)
            {
                throw new Exception($"Only {cartItem.Product.Stock} items available");
            }

            _cartRepository
                .Update(cartItem);

            await _cartRepository
                .SaveChangesAsync();
        }

    public CartService( ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

    public async Task RemoveFromCartAsync( int userId,int cartItemId)
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
