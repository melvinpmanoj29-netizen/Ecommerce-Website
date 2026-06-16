using Ecommerce.API.Data;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Repositories.Implementations;
using Ecommerce.API.Services.Interfaces;
using Ecommerce.API.Services.Implementations;
using Ecommerce.API.Mappings;
using Ecommerce.API.Validators;
using Ecommerce.API.Extensions;
using Ecommerce.API.Authentication;
using Ecommerce.API.Cloudinary;

using FluentValidation;
using FluentValidation.AspNetCore;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using CloudinaryDotNet;

using System.Text;
using Ecommerce.API.Email;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

 builder.Services.Configure<StripeSettings>(
    builder.Configuration.GetSection(
        "StripeSettings")); 

builder.Services.AddScoped<
    IPaymentService,
    PaymentService>();
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(
        "EmailSettings"));

builder.Services.AddScoped<
    IEmailService,
    EmailService>();    


    builder.Services.AddScoped<
    IPaymentService,
    PaymentService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"));
});

builder.Services.AddAutoMapper(
    typeof(ProductMappingProfile),
    typeof(CategoryMappingProfile));

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<
    CreateProductValidator>();

// =========================
// Repositories
// =========================

builder.Services.AddScoped<
    IProductRepository,
    ProductRepository>();

builder.Services.AddScoped<
    ICategoryRepository,
    CategoryRepository>();

builder.Services.AddScoped<
    IReviewRepository,
    ReviewRepository>();

builder.Services.AddScoped<
    IUserRepository,
    UserRepository>();

builder.Services.AddScoped<
    ICartRepository,
    CartRepository>();

builder.Services.AddScoped<
    IOrderRepository,
    OrderRepository>();

// =========================
// Services
// =========================

builder.Services.AddScoped<
    IProductService,
    ProductService>();

builder.Services.AddScoped<
    ICategoryService,
    CategoryService>();

builder.Services.AddScoped<
    IReviewService,
    ReviewService>();

builder.Services.AddScoped<
    IJwtService,
    JwtService>();

builder.Services.AddScoped<
    IAuthService,
    AuthService>();

builder.Services.AddScoped<
    ICartService,
    CartService>();

builder.Services.AddScoped<
    IOrderService,
    OrderService>();

builder.Services
    .AddScoped<IUserService,
        UserService>();

// =========================
// Cloudinary
// =========================

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection(
        "CloudinarySettings"));

var cloudinarySettings =
    builder.Configuration
        .GetSection("CloudinarySettings")
        .Get<CloudinarySettings>();

if (cloudinarySettings != null)
{
    var account = new CloudinaryDotNet.Account(
    cloudinarySettings.CloudName,
    cloudinarySettings.ApiKey,
    cloudinarySettings.ApiSecret);

    var cloudinary =
        new Cloudinary(account);

    builder.Services.AddSingleton(cloudinary);
}

builder.Services.AddScoped<
    ICloudinaryService,
    CloudinaryService>();

// =========================
// JWT
// =========================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection(
        "JwtSettings"));

var jwtSettings =
    builder.Configuration
        .GetSection("JwtSettings")
        .Get<JwtSettings>();

if (jwtSettings != null)
{
    builder.Services
        .AddAuthentication(
            JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters =
                new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer =
                        jwtSettings.Issuer,

                    ValidAudience =
                        jwtSettings.Audience,

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                jwtSettings.SecretKey))
                };
        });
}

builder.Services.AddAuthorization();

// =========================
// Build App
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ReactApp",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
        });
});

var app = builder.Build();

var stripeSettings =
    builder.Configuration
        .GetSection("StripeSettings")
        .Get<StripeSettings>();
        

Stripe.StripeConfiguration.ApiKey =
    stripeSettings?.SecretKey;



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseGlobalExceptionMiddleware();

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();