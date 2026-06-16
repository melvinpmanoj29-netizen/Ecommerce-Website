using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;
using Stripe.Checkout;
using Ecommerce.API.Authentication;
using Microsoft.Extensions.Options;

namespace Ecommerce.API.Services.Implementations;

public class PaymentService
    : IPaymentService
{
    private readonly IOrderService _orderService;

    private readonly StripeSettings _stripeSettings;

    private readonly ICartRepository
        _cartRepository;

    public PaymentService(
    ICartRepository cartRepository,
    IOrderService orderService,
    IOptions<StripeSettings> stripeOptions)
{
    _cartRepository = cartRepository;
    _orderService = orderService;
    _stripeSettings = stripeOptions.Value;
}   
public async Task HandleWebhookAsync(
    string json,
    string signatureHeader)
{
    // We'll add the Stripe logic later
    await Task.CompletedTask;
}

    public async Task<string>
        CreateCheckoutSessionAsync(
            int userId)
    {
        var cartItems =
            await _cartRepository
                .GetUserCartAsync(userId);

        var lineItems =
            cartItems.Select(item =>
                new SessionLineItemOptions
                {
                    Quantity =
                        item.Quantity,

                    PriceData =
                        new SessionLineItemPriceDataOptions
                        {
                            Currency = "inr",

                            UnitAmount =
                                (long)(
                                    item.Product.Price * 100
                                ),

                            ProductData =
                                new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name =
                                        item.Product.Name,

                                    Images =
                                    new List<string>
                                    {
                                        item.Product.ImageUrl
                                    }
                                }
                        }
                }).ToList();

        var options =
            new SessionCreateOptions
            {
                Mode = "payment",

                SuccessUrl ="http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

                CancelUrl ="http://localhost:5173/payment-cancelled",

                LineItems =
                    lineItems,

                Metadata =
                    new Dictionary<string, string>
                    {
                        {
                            "userId",
                            userId.ToString()
                        }
                    }
            };

        var service =
            new SessionService();

        var session =
            await service.CreateAsync(
                options);

        return session.Url;
    }
}