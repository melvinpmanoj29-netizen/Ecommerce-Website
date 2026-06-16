using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;

namespace Ecommerce.API.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponseDto>>
        GetProductsAsync();

    Task<ProductResponseDto?>
        GetByIdAsync(int id);

    Task CreateProductAsync(CreateProductRequestDto dto);

    Task UpdateAsync(
    int id,
    UpdateProductRequestDto dto);

Task DeleteAsync(int id);

Task<IEnumerable<ProductResponseDto>>
    SearchAsync(
        string? search,
        int pageNumber,
        int pageSize);


     
}