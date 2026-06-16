using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService
        _cartService;

    public CartController(
        ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId()
{
    var userIdClaim =
        User.FindFirst(
            ClaimTypes.NameIdentifier
        );

    if (userIdClaim == null)
    {
        throw new Exception(
            "User not found"
        );
    }

    return int.Parse(
        userIdClaim.Value
    );
}

    [HttpPost("add")]
    public async Task<IActionResult>
        AddToCart(
            AddToCartRequestDto dto)
    {
        await _cartService  
            .AddToCartAsync(
                GetUserId(),
                dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Item added to cart"
            });
    }

    [HttpGet]
    public async Task<IActionResult>
        GetCart()
    {
        var cart =
            await _cartService
                .GetCartAsync(
                    GetUserId());

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "Cart fetched",
                Data = cart
            });
    }

    [HttpPut("update")]
    public async Task<IActionResult>
        UpdateCart(
            UpdateCartRequestDto dto)
    {
        await _cartService
            .UpdateCartAsync(
                GetUserId(),
                dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Cart updated"
            });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult>
        Remove(int id)
    {
        await _cartService
            .RemoveFromCartAsync(
                GetUserId(),
                id);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Item removed"
            });
    }
}