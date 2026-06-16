using AutoMapper;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository
        _categoryRepository;

    private readonly IMapper _mapper;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _categoryRepository =
            categoryRepository;

        _mapper = mapper;
    }

    public async Task<
        IEnumerable<CategoryResponseDto>>
        GetAllAsync()
    {
        var categories =
            await _categoryRepository
            .GetAllAsync();

        return _mapper.Map<
            IEnumerable<CategoryResponseDto>>
            (categories);
    }

    public async Task<CategoryResponseDto?>
        GetByIdAsync(int id)
    {
        var category =
            await _categoryRepository
            .GetByIdAsync(id);

        if (category == null)
            return null;

        return _mapper.Map<
            CategoryResponseDto>
            (category);
    }

    public async Task CreateAsync(
        CreateCategoryRequestDto dto)
    {
        var category =
            _mapper.Map<Category>(dto);

        await _categoryRepository
            .AddAsync(category);

        await _categoryRepository
            .SaveChangesAsync();
    }

    public async Task UpdateAsync(
        int id,
        UpdateCategoryRequestDto dto)
    {
        var category =
            await _categoryRepository
            .GetByIdAsync(id);

        if (category == null)
            throw new Exception(
                "Category not found");

        category.Name = dto.Name;
        category.ImageUrl = dto.ImageUrl;

        _categoryRepository
            .Update(category);

        await _categoryRepository
            .SaveChangesAsync();
    }

    public async Task DeleteAsync(
        int id)
    {
        var category =
            await _categoryRepository
            .GetByIdAsync(id);

        if (category == null)
            throw new Exception(
                "Category not found");

        _categoryRepository
            .Delete(category);

        await _categoryRepository
            .SaveChangesAsync();
    }
}