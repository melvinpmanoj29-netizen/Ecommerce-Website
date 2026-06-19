using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses; 
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult>
        Register(RegisterRequestDto dto)
    {
        await _authService.RegisterAsync(dto);

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "User registered"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult>
        Login(LoginRequestDto dto)
    {
        var result =
            await _authService
            .LoginAsync(dto);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Login successful",
            Data = result
        });
    }
    [HttpPost("google-register")]
    public async Task<IActionResult> GoogleRegister(
    GoogleAuthRequestDto dto)
    {
    var result =
    await _authService.GoogleRegisterAsync(dto.IdToken);


    return Ok(new ApiResponse<AuthResponseDto>
    {
        Success = true,
        Message = "Registration successful",
        Data = result
    });

    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin(
    GoogleAuthRequestDto dto)
    {
    var result =
    await _authService.GoogleLoginAsync(dto.IdToken);

    return Ok(new ApiResponse<AuthResponseDto>
    {
        Success = true,
        Message = "Login successful",
        Data = result
    });

    }


    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequestDto dto)
    {
        await _authService.ForgotPasswordAsync(dto);

        // Always return success even if email not found for security
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "If an account with that email exists, a reset link has been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto dto)
    {
        try
        {
            await _authService.ResetPasswordAsync(dto);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Password has been reset successfully."
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