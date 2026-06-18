using Ecommerce.API.Common;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(
        IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products =
            await _productService.GetProductsAsync();

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message = "Products fetched",
                Data = products
            });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product =
            await _productService.GetByIdAsync(id);

        return Ok(product);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        string search = "",
        int pageNumber = 1,
        int pageSize = 8,
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null)
    {
        var products = await _productService.SearchProductsAsync(
            search,
            pageNumber,
            pageSize,
            categoryId,
            minPrice,
            maxPrice);

        return Ok(products);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateProductRequestDto dto)
    {
        await _productService.CreateProductAsync(dto);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message = "Product created"
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateProductRequestDto dto)
    {
        await _productService.UpdateAsync(id, dto);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Product updated"
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _productService.DeleteAsync(id);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Product deleted"
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult AdminOnly()
    {
        return Ok(new
        {
            Message = "Admin access granted"
        });
    }
}