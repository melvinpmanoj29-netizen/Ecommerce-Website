using Ecommerce.API.Common;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController
    : ControllerBase
{
    private readonly ICloudinaryService
        _cloudinaryService;

    public UploadController(
        ICloudinaryService cloudinaryService)
    {
        _cloudinaryService =
            cloudinaryService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult>
        Upload(
            IFormFile file)
    {
        var imageUrl =
            await _cloudinaryService
                .UploadImageAsync(file);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Upload successful",
                Data = imageUrl
            });
    }
}