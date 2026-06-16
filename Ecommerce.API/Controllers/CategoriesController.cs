using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController
    : ControllerBase
{
    private readonly ICategoryService
        _categoryService;

    public CategoriesController(
        ICategoryService categoryService)
    {
        _categoryService =
            categoryService;
    }

    [HttpGet]
    public async Task<IActionResult>
        GetAll()
        
    {
        var categories =
            await _categoryService
            .GetAllAsync();

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message =
                    "Categories fetched",
                Data = categories
            });
    }
    [HttpGet("{id}")]
public async Task<IActionResult>
    GetById(int id)
{
    var category =
        await _categoryService
            .GetByIdAsync(id);

    if (category == null)
    {
        return NotFound(
            new ApiResponse<string>
            {
                Success = false,
                Message =
                    "Category not found"
            });
    }

    return Ok(category);
}   

    [HttpPost]
    public async Task<IActionResult>
        Create(
            CreateCategoryRequestDto dto)
    {
        await _categoryService
            .CreateAsync(dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Category created"
            });
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult>
        Update(
            int id,
            UpdateCategoryRequestDto dto)
    {
        await _categoryService
            .UpdateAsync(
                id,
                dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Category updated"
            });
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult>
        Delete(int id)
    {
        await _categoryService
            .DeleteAsync(id);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message =
                    "Category deleted"
            });
    }
}