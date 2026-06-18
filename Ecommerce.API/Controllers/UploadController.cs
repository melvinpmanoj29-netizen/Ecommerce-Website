using Ecommerce.API.Common;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly ICloudinaryService _cloudinaryService;

    public UploadController(
        ICloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Upload(
        IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(
                    new ApiResponse<string>
                    {
                        Success = false,
                        Message = "No file was provided."
                    });
            }

            var imageUrl =
                await _cloudinaryService
                    .UploadImageAsync(file);

            return Ok(
                new ApiResponse<string>
                {
                    Success = true,
                    Message = "Upload successful",
                    Data = imageUrl
                });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());

            return StatusCode(
                500,
                new ApiResponse<string>
                {
                    Success = false,
                    Message = ex.Message
                });
        }
    }
}