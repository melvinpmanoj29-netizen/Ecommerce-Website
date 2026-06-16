using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>>
        GetAllAsync();

    Task<CategoryResponseDto?>
        GetByIdAsync(int id);

    Task CreateAsync(
        CreateCategoryRequestDto dto);

    Task UpdateAsync(
        int id,
        UpdateCategoryRequestDto dto);

    Task DeleteAsync(int id);
}