using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/admin/analytics")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(
        IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAnalytics()
    {
        var data = await _analyticsService
            .GetAnalyticsAsync();

        return Ok(new ApiResponse<AnalyticsResponseDto>
        {
            Success = true,
            Message = "Analytics retrieved successfully",
            Data = data
        });
    }
}