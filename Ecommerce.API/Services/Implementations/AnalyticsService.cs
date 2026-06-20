using Ecommerce.API.DTOs.Responses;
using Ecommerce.API.Repositories.Interfaces;
using Ecommerce.API.Services.Interfaces;

namespace Ecommerce.API.Services.Implementations;

public class AnalyticsService : IAnalyticsService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public AnalyticsService(
        IOrderRepository orderRepository,
        IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    public async Task<AnalyticsResponseDto> GetAnalyticsAsync()
    {
        var orders = (await _orderRepository
            .GetAllOrdersAsync())
            .ToList();

        var products = (await _productRepository
            .GetAllAsync())
            .ToList();

        var totalRevenue =
            orders.Sum(x => x.TotalAmount);

        var totalOrders =
            orders.Count;

        var totalProductsSold =
            orders.SelectMany(x => x.OrderItems)
                  .Sum(x => x.Quantity);

        var averageOrderValue =
            totalOrders == 0
                ? 0
                : totalRevenue / totalOrders;

        var totalProfit =
            orders.SelectMany(x => x.OrderItems)
                .Sum(item =>
                    (item.Price - item.Product.CostPrice)
                    * item.Quantity);

        var profitMargin =
            totalRevenue == 0
                ? 0
                : (totalProfit / totalRevenue) * 100;

        var expectedInventoryProfit =
            products.Sum(product =>
                (product.Price - product.CostPrice)
                * product.Stock);

        var monthlyRevenue =
            orders.GroupBy(x => new
                {
                    x.CreatedDate.Year,
                    x.CreatedDate.Month
                })
                .OrderBy(x => x.Key.Year)
                .ThenBy(x => x.Key.Month)
                .Select(x => new MonthlyRevenueDto
                {
                    Month =
                        $"{x.Key.Month:D2}/{x.Key.Year}",

                    Revenue =
                        x.Sum(order => order.TotalAmount)
                })
                .ToList();

        var topProducts =
            orders.SelectMany(x => x.OrderItems)
                  .GroupBy(x => x.Product.Name)
                  .Select(x => new TopProductDto
                  {
                      ProductName = x.Key,

                      QuantitySold =
                          x.Sum(item => item.Quantity)
                  })
                  .OrderByDescending(x => x.QuantitySold)
                  .Take(5)
                  .ToList();

        var mostProfitableProducts =
            orders.SelectMany(x => x.OrderItems)
                .GroupBy(x => x.Product.Name)
                .Select(group => new ProfitableProductDto
                {
                    ProductName = group.Key,

                    Profit = group.Sum(item =>
                        (item.Price - item.Product.CostPrice)
                        * item.Quantity)
                })
                .OrderByDescending(x => x.Profit)
                .Take(5)
                .ToList();

        var lastThreeMonths = orders
            .Where(o => o.CreatedDate >= DateTime.UtcNow.AddMonths(-3))
            .ToList();

        var groupedForecastData = lastThreeMonths
            .GroupBy(o => new
            {
                o.CreatedDate.Year,
                o.CreatedDate.Month
            })
            .Select(g => new
            {
                Revenue = g.Sum(x => x.TotalAmount),

                Orders = g.Count(),

                Profit = g.SelectMany(x => x.OrderItems)
                        .Sum(item =>
                            (item.Price - item.Product.CostPrice)
                            * item.Quantity)
            })
            .ToList();

        var forecastedRevenue =
            groupedForecastData.Any()
                ? groupedForecastData.Average(x => x.Revenue)
                : 0;

        var forecastedOrders =
            groupedForecastData.Any()
                ? (int)Math.Round(
                    groupedForecastData.Average(x => x.Orders))
                : 0;

        var forecastedProfit =
            groupedForecastData.Any()
                ? groupedForecastData.Average(x => x.Profit)
                : 0;

        var lowStockProducts =
            products.Where(x => x.Stock <= 10)
                    .OrderBy(x => x.Stock)
                    .Select(x => new LowStockProductDto
                    {
                        ProductId = x.Id,

                        ProductName = x.Name,

                        Stock = x.Stock
                    })
                    .ToList();

        return new AnalyticsResponseDto
        {
            TotalRevenue = totalRevenue,

            TotalOrders = totalOrders,

            TotalProductsSold = totalProductsSold,

            AverageOrderValue = averageOrderValue,

            TotalProfit = totalProfit,

            ProfitMargin = profitMargin,

            ExpectedInventoryProfit = expectedInventoryProfit,

            ForecastedRevenue = forecastedRevenue,

            ForecastedProfit = forecastedProfit,

            ForecastedOrders = forecastedOrders,

            MostProfitableProducts = mostProfitableProducts,

            MonthlyRevenue = monthlyRevenue,

            TopProducts = topProducts,

            LowStockProducts = lowStockProducts
        };
    }
}