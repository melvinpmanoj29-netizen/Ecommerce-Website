using Ecommerce.API.Models;

namespace Ecommerce.API.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}