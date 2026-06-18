import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAllOrders, updateOrderStatus } from "../../services/adminOrderService";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaShoppingBag } from "react-icons/fa";

function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      // Sort orders descending (newest first)
      setOrders([...data].sort((a: any, b: any) => b.id - a.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      loadOrders();
    } catch {
      toast.error("Status update failed");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-150 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900";
      case "Processing":
        return "bg-blue-150 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900";
      case "Pending":
        return "bg-yellow-150 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-450 dark:border-yellow-900";
      case "Cancelled":
        return "bg-red-150 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900";
      case "Shipped":
        return "bg-purple-150 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900";
      default:
        return "bg-gray-150 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700";
    }
  };

  return (
    <MainLayout>
      <div className="py-6">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-6 border-b border-theme pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Manage Orders
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">Track, audit, and modify customer order flows</p>
          </div>
        </div>

        {/* Orders timeline lists */}
        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874F0]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm transition-colors duration-200">
            <FaShoppingBag size={48} className="mx-auto text-theme-muted mb-4" />
            <p className="text-sm text-theme-muted">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-theme-card border border-theme rounded-md p-5 shadow-sm transition-colors duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                
                {/* Details layout */}
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm md:text-base font-bold text-theme-primary">
                    Order ID: #{order.id}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-theme-muted font-semibold">
                    <span className="flex items-center gap-1"><FaCalendarAlt size={10} /> {new Date(order.createdDate).toLocaleDateString()}</span>
                    <span>Total Amount: <strong className="text-[#2874F0] dark:text-[#5897ff]">₹{order.totalAmount}</strong></span>
                  </div>
                </div>

                {/* Adjust status form controls */}
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end border-t border-theme/40 md:border-t-0 pt-3 md:pt-0">
                  
                  {/* Status pill */}
                  <span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>

                  {/* Selector field */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-theme-body border border-theme p-1.5 py-1 text-xs font-semibold focus:outline-none rounded shadow-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminOrdersPage;