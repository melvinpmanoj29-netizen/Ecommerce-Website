using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController
    : ControllerBase
{ 
    private readonly IPaymentService _paymentService;

    public PaymentsController(
        IPaymentService paymentService)
    {
        _paymentService =
            paymentService;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    [HttpPost("checkout")]
    public async Task<IActionResult>
        Checkout()
    {
        var url =
            await _paymentService
                .CreateCheckoutSessionAsync(
                    GetUserId());

        return Ok(new
        {
            url
        });
    }
    [AllowAnonymous]
[HttpPost("webhook")]
public async Task<IActionResult> Webhook()
{
    using var reader =
        new StreamReader(
            HttpContext.Request.Body);

    var json =
        await reader.ReadToEndAsync();

    var signature =
        Request.Headers["Stripe-Signature"];

    await _paymentService
        .HandleWebhookAsync(
            json,
            signature!);

    return Ok();
}
}