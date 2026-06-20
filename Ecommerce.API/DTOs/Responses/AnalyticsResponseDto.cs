namespace Ecommerce.API.DTOs.Responses;

public class AnalyticsResponseDto
{
    public decimal TotalRevenue { get; set; }

    public int TotalOrders { get; set; }

    public int TotalProductsSold { get; set; }

    public decimal AverageOrderValue { get; set; }

    public decimal TotalProfit { get; set; }

    public decimal ProfitMargin { get; set; }

    public decimal ExpectedInventoryProfit { get; set; }

    public decimal ForecastedRevenue { get; set; }

    public decimal ForecastedProfit { get; set; }

    public int ForecastedOrders { get; set; }

    public List<ProfitableProductDto> MostProfitableProducts { get; set; } = [];

    public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = [];

    public List<TopProductDto> TopProducts { get; set; } = [];

    public List<LowStockProductDto> LowStockProducts { get; set; } = [];
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty;

    public decimal Revenue { get; set; }
}

public class TopProductDto
{
    public string ProductName { get; set; } = string.Empty;

    public int QuantitySold { get; set; }
}

public class LowStockProductDto
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Stock { get; set; }
}

public class ProfitableProductDto
{
    public string ProductName { get; set; } = string.Empty;

    public decimal Profit { get; set; }
}