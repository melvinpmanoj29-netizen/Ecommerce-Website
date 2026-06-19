using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequestDto dto);

    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);

    Task<AuthResponseDto> GoogleLoginAsync(string idToken);

    Task<AuthResponseDto> GoogleRegisterAsync(string idToken);

    Task ForgotPasswordAsync(ForgotPasswordRequestDto dto);

    Task ResetPasswordAsync(ResetPasswordRequestDto dto);

}