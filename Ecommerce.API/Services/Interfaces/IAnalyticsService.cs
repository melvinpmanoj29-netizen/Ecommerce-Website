using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsResponseDto> GetAnalyticsAsync();
}