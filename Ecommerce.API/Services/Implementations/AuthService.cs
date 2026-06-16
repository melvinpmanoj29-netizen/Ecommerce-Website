using BCrypt.Net;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task RegisterAsync(
        RegisterRequestDto dto)
    {
        var existingUser =
            await _userRepository
            .GetByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            throw new Exception(
                "Email already exists");
        }

        var user = new User
        {
            Name = dto.Name,

            Email = dto.Email,

            PasswordHash =
                BCrypt.Net.BCrypt
                .HashPassword(dto.Password),

            Role = "User",

            CreatedDate =
                DateTime.UtcNow
        };

        await _userRepository
            .AddAsync(user);

        await _userRepository
            .SaveChangesAsync();
    }

    public async Task<AuthResponseDto>
        LoginAsync(LoginRequestDto dto)
    {
        var user =
            await _userRepository
            .GetByEmailAsync(dto.Email);

        if (user == null)
        {
            throw new Exception(
                "Invalid credentials");
        }

        var validPassword =
            BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash);

        if (!validPassword)
        {
            throw new Exception(
                "Invalid credentials");
        }

        return new AuthResponseDto
        {
            Token =
                _jwtService
                .GenerateToken(user),

            Name = user.Name,

            Email = user.Email,

            Role = user.Role
        };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequestDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            // Do not reveal that the user does not exist
            return;
        }

        user.ResetPasswordToken = Guid.NewGuid().ToString();
        user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);

        await _userRepository.SaveChangesAsync();

        var resetLink = $"http://localhost:5173/reset-password?token={user.ResetPasswordToken}&email={user.Email}";

        var emailHtml = $"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hello {user.Name},</p>
                <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p>To reset your password, click the button below (this link is valid for 1 hour):</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="{resetLink}">{resetLink}</a></p>
                <p>Thanks,<br>The ME10XLUXE Team</p>
            </div>
            """;

        await _emailService.SendEmailAsync(user.Email, "Reset Your Password - ME10XLUXE", emailHtml);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequestDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null || user.ResetPasswordToken != dto.Token || user.ResetPasswordTokenExpiry < DateTime.UtcNow)
        {
            throw new Exception("Invalid or expired reset token.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;

        await _userRepository.SaveChangesAsync();
    }
}