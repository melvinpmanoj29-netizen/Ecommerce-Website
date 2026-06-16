using AutoMapper;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;

namespace Ecommerce.API.Mappings;

public class CategoryMappingProfile
    : Profile
{
    public CategoryMappingProfile()
    {
        CreateMap<Category,
            CategoryResponseDto>();

        CreateMap<
            CreateCategoryRequestDto,
            Category>();

        CreateMap<
            UpdateCategoryRequestDto,
            Category>();
    }
}