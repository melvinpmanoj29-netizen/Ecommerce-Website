using AutoMapper;
using Ecommerce.API.DTOs.Requests;
using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Models;

namespace Ecommerce.API.Mappings;

public class ProductMappingProfile
    : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<
            CreateProductRequestDto,
            Product>();

        CreateMap<
            Product,
            ProductResponseDto>()
            .ForMember(
                dest => dest.CategoryName,
                opt => opt.MapFrom(
                    src => src.Category.Name))
            .ForMember(
                dest => dest.CategoryId,
                opt => opt.MapFrom(
                    src => src.CategoryId));
    }
}