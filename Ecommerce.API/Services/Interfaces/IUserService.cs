using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>>
        GetAllAsync();

    Task DeleteAsync(int id);

    Task UpdateRoleAsync(
    int id,
    string role);
}