using Ecommerce.API.Common;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService
        _orderService;

    public OrdersController(
        IOrderService orderService)
    {
        _orderService =
            orderService;
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

    [HttpPost]
    public async Task<IActionResult>
        Checkout()
    {
        await _orderService
            .CreateOrderAsync(
                GetUserId());

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Order created"
            });
    }

    [HttpGet]
    public async Task<IActionResult>
        GetOrders()
    {
       try
    {
        var userId = GetUserId();

        var orders =
            await _orderService
                .GetOrdersAsync(userId);
                Console.WriteLine(
    User.Identity?.IsAuthenticated
);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message = "Orders fetched",
                Data = orders
            });
    }
    catch (Exception ex)
    {
        return StatusCode(500,
            ex.ToString());
    }
    }
    [HttpGet("admin")]
    public async Task<IActionResult>
        GetAllOrders()
    {
        var orders =
            await _orderService
                .GetAllOrdersAsync();

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "All orders fetched",
                Data = orders
            });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult>
        GetOrder(int id)
    {
        var order =
            await _orderService
                .GetOrderByIdAsync(id);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "Order fetched",
                Data = order
            });
    }
    [HttpPut("{id}/status")]
    public async Task<IActionResult>
        UpdateStatus(
            int id,
            string status)
    {
        await _orderService
            .UpdateOrderStatusAsync(
                id,
                status);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Status updated"
            });
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        await _orderService.CancelOrderAsync(
            id,
            GetUserId());

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Order cancelled successfully"
            });
    }

    [HttpPost("{id}/request-return")]
    public async Task<IActionResult> RequestReturn(int id)
    {
        await _orderService.RequestReturnAsync(
            id,
            GetUserId());

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Return and refund requested successfully"
            });
    }
}   