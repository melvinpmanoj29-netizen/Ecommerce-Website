using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecommerce.API.Models;
using Ecommerce.API.Cloudinary;
using Ecommerce.API.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Ecommerce.API.Services.Implementations;

public class CloudinaryService : ICloudinaryService
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary;

    public CloudinaryService(
        IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret);

        _cloudinary =
            new CloudinaryDotNet.Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(
        IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("No file provided.");
        }

        await using var stream =
            file.OpenReadStream();

        var uploadParams =
            new ImageUploadParams
            {
                File = new FileDescription(
                    file.FileName,
                    stream)
            };

        var result =
            await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            throw new Exception(result.Error.Message);
        }

        return result.SecureUrl.ToString();
    }
}