using Ecommerce.API.Middleware;

namespace Ecommerce.API.Extensions;

public static class
ExceptionMiddlewareExtension
{
    public static IApplicationBuilder
        UseGlobalExceptionMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<   ExceptionMiddleware>();
    }
}