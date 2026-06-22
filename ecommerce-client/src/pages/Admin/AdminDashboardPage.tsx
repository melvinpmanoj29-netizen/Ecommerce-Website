import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAnalytics } from "../../services/analyticsService";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getAllOrders } from "../../services/adminOrderService";
import { FaBoxes, FaTags, FaShoppingBag, FaUsers, FaArrowRight, FaChartLine, FaChartBar } from "react-icons/fa";


function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
    loadStats();
    checkLowStock();
  }, []);

  const loadStats = async () => {
    try {
      const products = await getProducts();
      const categories = await getCategories();
      const orders = await getAllOrders();

      setProductCount(products.length);
      setCategoryCount(categories.length);
      setOrderCount(orders.length);
      setRecentOrders(
        [...orders]
          .sort((a: any, b: any) => b.id - a.id)
          .slice(0, 5)
      );
    } catch (error) {
      console.error(error);
    }
  };
  const checkLowStock = async () => {
      try {
        const analytics = await getAnalytics();

        if (analytics.lowStockProducts.length === 0) {
          return;
        }

        const lastAlert = localStorage.getItem(
          "lastLowStockAlert"
        );

        const twelveHours = 12 * 60 * 60 * 1000;

        if (
          !lastAlert ||
          Date.now() - Number(lastAlert) > twelveHours
        ) {
          toast.error(
            `⚠️ ${analytics.lowStockProducts.length} product${
              analytics.lowStockProducts.length > 1 ? "s are" : " is"
            } running low on stock`,
            {
              duration: 6000,
            }
          );

          localStorage.setItem(
            "lastLowStockAlert",
            Date.now().toString()
          );
          console.log("Low stock products:", analytics.lowStockProducts);
console.log("Last alert:", localStorage.getItem("lastLowStockAlert"));
        }
      } catch (error) {
        console.error(error);
        
      }
    };

  return (
    <MainLayout>
      <div className="py-6">
        
        {/* Title row */}
        <div className="flex items-center gap-3 mb-8 border-b border-theme pb-4">
          <div className="w-10 h-10 bg-[#FB641B]/10 rounded-full flex items-center justify-center text-xl text-[#FB641B]">
            <FaChartLine />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Admin Control Panel
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Manage stock, categories, orders, and user privileges</p>
          </div>
        </div>

        {/* Info widgets row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-theme-card border border-theme p-6 rounded-md text-center shadow-sm relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-3 right-3 text-[#2874F0]/10 text-4xl"><FaBoxes /></div>
            <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-2">
              Total Products
            </h2>
            <p className="text-4xl font-black text-[#2874F0] dark:text-[#5897ff]">
              {productCount}
            </p>
          </div>

          <div className="bg-theme-card border border-theme p-6 rounded-md text-center shadow-sm relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-3 right-3 text-green-600/10 text-4xl"><FaTags /></div>
            <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-2">
              Categories
            </h2>
            <p className="text-4xl font-black text-green-600">
              {categoryCount}
            </p>
          </div>

          <div className="bg-theme-card border border-theme p-6 rounded-md text-center shadow-sm relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-3 right-3 text-orange-500/10 text-4xl"><FaShoppingBag /></div>
            <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-2">
              Total Orders
            </h2>
            <p className="text-4xl font-black text-[#FB641B]">
              {orderCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders Card */}
          <div className="bg-theme-card border border-theme rounded-md p-5 shadow-sm lg:col-span-2 transition-colors duration-200">
            <h2 className="text-base font-bold text-theme-primary mb-4 font-outfit">
              Recent Transactions
            </h2>

            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-theme-muted italic py-6 text-center">
                  No transaction records available.
                </p>
              ) : (
                <table className="w-full text-left border-collapse text-xs md:text-sm text-theme-secondary">
                  <thead>
                    <tr className="border-b border-theme/80 font-semibold text-theme-primary">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme/40">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-theme-body/20">
                        <td className="py-3 font-semibold text-[#2874F0] dark:text-[#5897ff]">#{order.id}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-theme-primary">₹{order.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Admin Actions menu */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-theme-muted uppercase tracking-wider">
              Management Controls
            </h2>

            <Link
              to="/admin/products"
              className="group flex items-center justify-between p-4 bg-theme-card border border-theme rounded-md shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-[#5897ff] rounded-full flex items-center justify-center text-sm">
                  <FaBoxes />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-theme-primary">Manage Products</h3>
                  <p className="text-[11px] text-theme-muted mt-0.5">Add, edit, or remove catalog items</p>
                </div>
              </div>
              <FaArrowRight size={12} className="text-theme-muted group-hover:text-[#2874F0] group-hover:translate-x-1.5 transition-all" />
            </Link>

            <Link
              to="/admin/categories"
              className="group flex items-center justify-between p-4 bg-theme-card border border-theme rounded-md shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 dark:bg-slate-800 text-green-600 rounded-full flex items-center justify-center text-sm">
                  <FaTags />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-theme-primary">Manage Categories</h3>
                  <p className="text-[11px] text-theme-muted mt-0.5">Configure item search tags</p>
                </div>
              </div>
              <FaArrowRight size={12} className="text-theme-muted group-hover:text-[#2874F0] group-hover:translate-x-1.5 transition-all" />
            </Link>

            <Link
              to="/admin/orders"
              className="group flex items-center justify-between p-4 bg-theme-card border border-theme rounded-md shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 dark:bg-slate-800 text-[#FB641B] rounded-full flex items-center justify-center text-sm">
                  <FaShoppingBag />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-theme-primary">Manage Orders</h3>
                  <p className="text-[11px] text-theme-muted mt-0.5">Approve, ship, or process orders</p>
                </div>
              </div>
              <FaArrowRight size={12} className="text-theme-muted group-hover:text-[#2874F0] group-hover:translate-x-1.5 transition-all" />
            </Link>

            <Link
              to="/admin/users" className="group flex items-center justify-between p-4 bg-theme-card border border-theme rounded-md shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 dark:bg-slate-800 text-purple-600 rounded-full flex items-center justify-center text-sm">
                  <FaUsers />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-theme-primary">Manage Users</h3>
                  <p className="text-[11px] text-theme-muted mt-0.5">Configure administrator accounts</p>
                </div>
              </div>
              <FaArrowRight size={12} className="text-theme-muted group-hover:text-[#2874F0] group-hover:translate-x-1.5 transition-all" />
            </Link>
            <Link to="/admin/analytics" className="group flex items-center justify-between p-4 bg-theme-card border border-theme rounded-md shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-cyan-100 dark:bg-slate-800 text-cyan-600 rounded-full flex items-center justify-center text-sm">
                    <FaChartBar />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-theme-primary">
                      Analytics
                    </h3>

                    <p className="text-[11px] text-theme-muted mt-0.5">
                      View sales and inventory insights
                    </p>
                  </div>
                </div>

                <FaArrowRight
                  size={12}
                  className="text-theme-muted group-hover:text-[#2874F0] group-hover:translate-x-1.5 transition-all"
                />
              </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboardPage;