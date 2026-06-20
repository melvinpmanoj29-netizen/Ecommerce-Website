using AutoMapper;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(
        IProductRepository productRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductResponseDto>>
        GetProductsAsync()
    {
        var products = await _productRepository
            .GetAllAsync();

        return _mapper.Map<
            IEnumerable<ProductResponseDto>>
            (products);
    }

    public async Task<ProductResponseDto?>
        GetByIdAsync(int id)
    {
        var product = await _productRepository
            .GetByIdAsync(id);

        if (product == null)
            return null;

        return _mapper.Map<ProductResponseDto>(
            product);
    }

    public async Task CreateProductAsync(
        CreateProductRequestDto dto)
    {
        var product = _mapper.Map<Product>(dto);

        product.CreatedDate = DateTime.UtcNow;

        await _productRepository
            .AddAsync(product);

        await _productRepository
            .SaveChangesAsync();
    }
    public async Task UpdateAsync(
    int id,
    UpdateProductRequestDto dto)
    {
        var product =
            await _productRepository
                .GetByIdAsync(id);

        if (product == null)
            throw new Exception(
                "Product not found");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.CostPrice = dto.CostPrice;
        product.Stock = dto.Stock;
        product.ImageUrl = dto.ImageUrl;
        product.CategoryId = dto.CategoryId;

        _productRepository.Update(product);

        await _productRepository
            .SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var product =
            await _productRepository
                .GetByIdAsync(id);

        if (product == null)
            throw new Exception(
                "Product not found");

        _productRepository.Delete(product);

        await _productRepository
            .SaveChangesAsync();
    }

    public async Task<IEnumerable<ProductResponseDto>> SearchProductsAsync(
        string search,
        int pageNumber,
        int pageSize,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice)
    {
        var products = await _productRepository.SearchProductsAsync(
            search,
            pageNumber,
            pageSize,
            categoryId,
            minPrice,
            maxPrice);

        return products.Select(product => new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty
        });
    }
}