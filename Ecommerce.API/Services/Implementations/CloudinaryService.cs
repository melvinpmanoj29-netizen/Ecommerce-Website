using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class CloudinaryService
    : ICloudinaryService
{
    private readonly CloudinaryDotNet.Cloudinary
        _cloudinary;

    public CloudinaryService(
        CloudinaryDotNet.Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<string>
        UploadImageAsync(
            IFormFile file)
    {
        await using var stream =
            file.OpenReadStream();

        var uploadParams =
            new ImageUploadParams
            {
                File =
                    new FileDescription(
                        file.FileName,
                        stream)
            };

        var result =
            await _cloudinary
                .UploadAsync(
                    uploadParams);

        return result.SecureUrl
            .ToString();
    }
}