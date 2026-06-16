namespace Ecommerce.API.Services.Interfaces;

public interface IPaymentService
{
    Task<string> CreateCheckoutSessionAsync(
        int userId);

        Task HandleWebhookAsync(
    string json,
    string signatureHeader);
}
