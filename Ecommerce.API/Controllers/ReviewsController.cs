using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController
    : ControllerBase
{
    private readonly IReviewService
        _reviewService;

    public ReviewsController(
        IReviewService reviewService)
    {
        _reviewService =
            reviewService;
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

    //[Authorize]
    [HttpPost]
    public async Task<IActionResult>
        CreateReview(
            CreateReviewRequestDto dto)
    {
        await _reviewService
            .CreateReviewAsync(
                GetUserId(),
                dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Review created"
            });
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult>
        GetProductReviews(
            int productId)
    {
        var reviews =
            await _reviewService
                .GetProductReviewsAsync(
                    productId);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "Reviews fetched",
                Data = reviews
            });
    }
}