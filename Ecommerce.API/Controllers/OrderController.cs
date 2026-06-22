using Ecommerce.API.Common;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.API.Constants;
using Ecommerce.API.DTOs.Requests;

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

    return int.Parse(userIdClaim.Value);
}

    [HttpPost]
    public async Task<IActionResult>
        Checkout()
    {
        await _orderService.CreateOrderAsync(GetUserId());

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

    [Authorize(Roles = Roles.Admin)]
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
    [Authorize(Roles = Roles.Admin)]
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

    [Authorize(Roles = Roles.Admin)]
    [HttpPost("{id}/assign-delivery-agent")]
    public async Task<IActionResult> AssignDeliveryAgent(
        int id,
        int deliveryAgentId)
    {
        await _orderService.AssignDeliveryAgentAsync(
            id,
            deliveryAgentId);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Delivery agent assigned successfully"
            });
    }
    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpGet("delivery")]
    public async Task<IActionResult> GetAssignedOrders()
    {
        var deliveryAgentId = GetUserId();

        var orders =
            await _orderService.GetAssignedOrdersAsync(
                deliveryAgentId);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message = "Assigned orders fetched",
                Data = orders
            });
    }

    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpPut("{id}/delivery-status")]
    public async Task<IActionResult> UpdateDeliveryStatus(
        int id,
        string status)
    {
        return BadRequest(
            new ApiResponse<string>
            {
                Success = false,
                Message = "Manual status updates are no longer permitted. Please use the secure OTP verification flow."
            });
    }

    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpPost("{id}/start-delivery")]
    public async Task<IActionResult> StartDelivery(int id)
    {
        try
        {
            var deliveryAgentId = GetUserId();
            await _orderService.StartDeliveryAsync(id, deliveryAgentId);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Delivery started successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpPost("{id}/request-delivery-otp")]
    public async Task<IActionResult> RequestDeliveryOtp(int id)
    {
        try
        {
            var deliveryAgentId = GetUserId();
            await _orderService.RequestDeliveryOtpAsync(id, deliveryAgentId);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "OTP sent to customer email successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpPost("{id}/verify-delivery-otp")]
    public async Task<IActionResult> VerifyDeliveryOtp(int id, [FromBody] VerifyDeliveryOtpDto dto)
    {
        try
        {
            var deliveryAgentId = GetUserId();
            await _orderService.VerifyDeliveryOtpAsync(id, deliveryAgentId, dto.Otp);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "OTP verified successfully. Order delivered."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
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

    [Authorize(Roles = Roles.DeliveryAgent)]
    [HttpPost("{id}/request-emergency-otp")]
    public async Task<IActionResult> RequestEmergencyOtp(int id, [FromBody] RequestEmergencyOtpDto dto)
    {
        try
        {
            var deliveryAgentId = GetUserId();
            await _orderService.RequestEmergencyOtpAsync(id, deliveryAgentId, dto.Reason);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Emergency OTP request submitted to administrators"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost("{id}/approve-emergency-otp")]
    public async Task<IActionResult> ApproveEmergencyOtp(int id)
    {
        try
        {
            await _orderService.ApproveEmergencyOtpAsync(id);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Emergency OTP approved and sent to customer email"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet("~/api/admin/emergency-deliveries")]
    public async Task<IActionResult> GetEmergencyDeliveries()
    {
        try
        {
            var requests = await _orderService.GetEmergencyDeliveriesAsync();
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Emergency delivery requests fetched successfully",
                Data = requests
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }
}   