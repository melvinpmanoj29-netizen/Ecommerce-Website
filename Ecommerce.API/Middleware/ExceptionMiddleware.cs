using System.Net;
using Ecommerce.API.Common;

namespace Ecommerce.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(
        RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch(Exception ex)
        {
            context.Response.ContentType =
                "application/json";

            context.Response.StatusCode =
                (int)HttpStatusCode
                .InternalServerError;

            var response =
                new ApiResponse<string>
                {
                    Success = false,
                    Message = ex.Message
                };

            await context.Response
                .WriteAsJsonAsync(response);
        }
    }
}