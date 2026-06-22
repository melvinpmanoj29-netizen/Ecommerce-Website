using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;                                                                    
using Ecommerce.API.Constants;

namespace Ecommerce.API.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository
        _userRepository;

    public UserService(
        IUserRepository userRepository)
    {
        _userRepository =
            userRepository;
    }

    public async Task<
        IEnumerable<UserResponseDto>>
        GetAllAsync()
    {
        var users =
            await _userRepository
                .GetAllAsync();

        return users.Select(user =>
            new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedDate =
                    user.CreatedDate
            });
    }

    public async Task DeleteAsync(
        int id)
    {
        var user =
            await _userRepository
                .GetByIdAsync(id);

        if (user == null)
        {
            throw new Exception(
                "User not found");
        }

        await _userRepository
            .DeleteAsync(user);

        await _userRepository
            .SaveChangesAsync();
    }

    public async Task UpdateRoleAsync(
    int id,
    string role)
    {
        await _userRepository
            .UpdateRoleAsync(
                id,
                role);

        await _userRepository
            .SaveChangesAsync();
    }

    public async Task<IEnumerable<UserResponseDto>>
    GetDeliveryAgentsAsync()
    {
        var users = await _userRepository.GetAllAsync();

        return users
            .Where(x => x.Role == Roles.DeliveryAgent)
            .Select(x => new UserResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Role = x.Role
            });
    }
}