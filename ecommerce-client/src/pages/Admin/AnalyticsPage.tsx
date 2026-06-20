import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAnalytics } from "../../services/analyticsService";
import type { AnalyticsData } from "../../services/analyticsService";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

function AnalyticsPage() {
  const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
  };
  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-6">
          Loading analytics...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6 space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-theme-primary font-outfit">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-theme-muted mt-1">
            Sales and inventory insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">

          <div className="bg-theme-card border border-theme rounded-md p-6">
            <p className="text-sm text-theme-muted">
              Total Revenue
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
             ₹{formatCurrency(analytics?.totalRevenue ?? 0)}  
            </h2>
          </div>

          <div className="bg-theme-card border border-theme rounded-md p-6">
            <p className="text-sm text-theme-muted">
              Total Orders
            </p>

           <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
              {analytics?.totalOrders}
            </h2>
          </div>

          <div className="bg-theme-card border border-theme rounded-md p-6">
            <p className="text-sm text-theme-muted">
              Products Sold
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
              {analytics?.totalProductsSold}
            </h2>
          </div>

          <div className="bg-theme-card border border-theme rounded-md p-6">
            <p className="text-sm text-theme-muted">
              Average Order Value
            </p>

           <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
              ₹{formatCurrency(analytics?.averageOrderValue ?? 0)}
            </h2>
          </div>

        </div>
        <div className="bg-theme-card border border-theme rounded-md p-6">
          <p className="text-sm text-theme-muted">
            Expected Inventory Profit
          </p>

         <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
           ₹{formatCurrency(analytics?.expectedInventoryProfit ?? 0)}
          </h2>

          <p className="text-xs text-theme-muted mt-2">
            Estimated profit if all current inventory is sold.
          </p>
        </div>
        <div className="bg-theme-card border border-theme rounded-md p-6">
          <p className="text-sm text-theme-muted">
            Total Profit
          </p>

          <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
            ₹{formatCurrency(analytics?.totalProfit ?? 0)}
          </h2>
        </div>
        <div className="bg-theme-card border border-theme rounded-md p-6">
          <p className="text-sm text-theme-muted">
            Profit Margin
          </p>

         <h2 className="text-2xl lg:text-3xl font-bold break-words mt-2">
            {analytics?.profitMargin.toFixed(2)}%
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            <div className="bg-theme-card border border-theme rounded-md p-6">
                <h3 className="text-lg font-bold text-theme-primary mb-4">
                    Top Selling Products
                </h3>

               <div className="w-full min-h-[320px] h-[320px]">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={analytics?.topProducts}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="productName" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                            dataKey="quantitySold"
                            fill="#2874F0"
                            radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

         <div className="bg-theme-card border border-theme rounded-md p-6">
            <h3 className="text-lg font-bold text-theme-primary mb-4">
                Monthly Revenue
            </h3>

                <div className="w-full min-h-[320px] h-[320px]">
                      <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={analytics?.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="month" />

                            <YAxis />

                            <Tooltip />

                            <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#FB641B"
                            strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>

        </div>
          <div className="bg-theme-card border border-theme rounded-md p-6">
          <h3 className="text-lg font-bold text-theme-primary mb-4">
              Low Stock Products
          </h3>

          <div className="space-y-3">
            {analytics?.lowStockProducts.map((product) => (
            <div
                key={product.productId}
                className="flex justify-between border-b border-theme pb-2"
            >
                <span>{product.productName}</span>

                <span className="font-semibold text-red-500">
                {product.stock}
                </span>
            </div>
            ))}
            </div>
        </div>
        <div className="bg-theme-card border border-theme rounded-md p-6">
          <h3 className="text-lg font-bold text-theme-primary mb-4">
            Most Profitable Products
          </h3>

          <div className="space-y-3">
            {analytics?.mostProfitableProducts.map((product) => (
              <div
                key={product.productName}
                className="flex justify-between border-b border-theme pb-2"
              >
                <span>{product.productName}</span>

                <span className="font-semibold text-emerald-600">
                  ₹{formatCurrency(product.profit)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-theme-card border border-theme rounded-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-theme-primary">
            Next Month Forecast
          </h3>

          <p className="text-sm text-theme-muted mt-1">
            Based on the average performance of the last 3 months
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-theme-muted">
              Forecasted Revenue
            </p>

            <h3 className="text-2xl font-bold text-[#2874F0] mt-2 whitespace-nowrap">
              ₹{formatCurrency(analytics?.forecastedRevenue ?? 0)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-theme-muted">
              Forecasted Profit
            </p>

            <h3 className="text-2xl font-bold text-emerald-600 mt-2 whitespace-nowrap">
              ₹{formatCurrency(analytics?.forecastedProfit ?? 0)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-theme-muted">
              Forecasted Orders
            </p>

            <h3 className="text-2xl font-bold text-cyan-600 mt-2">
              {(analytics?.forecastedOrders ?? 0).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>
      </div>
      </div>
    </MainLayout>
  );
}

export default AnalyticsPage;