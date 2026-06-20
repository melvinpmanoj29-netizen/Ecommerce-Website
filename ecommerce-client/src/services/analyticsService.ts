import axiosInstance from "../api/axios";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface TopProduct {
  productName: string;
  quantitySold: number;
}

export interface LowStockProduct {
  productId: number;
  productName: string;
  stock: number;
}
export interface ProfitableProduct {
  productName: string;
  profit: number;
} 

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  totalProfit: number;
  profitMargin: number;
  expectedInventoryProfit: number;
  forecastedProfit: number;
  forecastedOrders: number;
  mostProfitableProducts: ProfitableProduct[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
  forecastedRevenue: number;

}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await axiosInstance.get(
    "/admin/analytics"
  );

  return response.data.data;
};