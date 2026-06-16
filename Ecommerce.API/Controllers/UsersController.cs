using Ecommerce.API.Common;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController
    : ControllerBase
{
    private readonly IUserService
        _userService;

    public UsersController(
        IUserService userService)
    {
        _userService =
            userService;
    }

    [HttpGet]
    public async Task<IActionResult>
        GetAll()
    {
        var users =
            await _userService
                .GetAllAsync();

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "Users fetched",
                Data = users
            });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult>
        Delete(int id)
    {
        await _userService
            .DeleteAsync(id);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "User deleted"
            });
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult>
        UpdateRole(
            int id,
            string role)
    {
        await _userService
            .UpdateRoleAsync(
                id,
                role);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =   
                    "Role updated"
            });
    }
}