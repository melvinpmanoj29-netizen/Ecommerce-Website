import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getOrders } from "../../services/orderService";
import type { Order } from "../../types/Order";
import { FaBoxOpen, FaCalendarAlt, FaReceipt } from "react-icons/fa";

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      // Sort orders descending (newest first)
      setOrders([...data].sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700/50";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-xl md:text-2xl font-bold text-theme-primary mb-6 font-outfit">
          My Orders ({orders.length})
        </h1>

        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874F0]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm transition-colors duration-200">
            <FaBoxOpen size={48} className="mx-auto text-theme-muted mb-4" />
            <h2 className="text-lg font-semibold text-theme-primary mb-1">No orders found</h2>
            <p className="text-sm text-theme-muted mb-4">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-theme-card border border-theme rounded-md shadow-sm overflow-hidden transition-colors duration-200"
              >
                {/* Order Header Row */}
                <div className="bg-gray-50 dark:bg-slate-900/40 px-5 py-4 border-b border-theme/80 flex flex-wrap justify-between items-center gap-3 text-xs md:text-sm font-semibold">
                  <div className="flex items-center gap-4">
                    <span className="text-theme-primary">Order ID: #{order.id}</span>
                    <span className="flex items-center gap-1.5 text-theme-muted font-medium">
                      <FaCalendarAlt size={11} />
                      {new Date(order.createdDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {/* Status pills badge */}
                  <span className={`px-2.5 py-1 rounded-sm text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items timeline list */}
                <div className="p-4 md:p-5 divide-y divide-theme/60">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="py-4 first:pt-1 last:pb-1 flex items-center gap-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-14 h-14 object-contain bg-white rounded border border-theme p-1 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-theme-primary truncate hover:text-[#2874F0] dark:hover:text-[#5897ff]">
                          {item.productName}
                        </h4>
                        <div className="flex gap-4 text-xs text-theme-muted mt-1 font-semibold">
                          <span>Qty: {item.quantity}</span>
                          <span>Price: ₹{item.price}</span>
                        </div>
                      </div>

                      {/* Subtotal of item */}
                      <span className="text-sm font-bold text-theme-primary shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer row */}
                <div className="bg-gray-50/50 dark:bg-slate-900/10 px-5 py-4 border-t border-theme/60 flex justify-between items-center gap-3">
                  <span className="text-xs text-theme-muted font-semibold flex items-center gap-1.5">
                    <FaReceipt /> Invoice Available
                  </span>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-theme-muted">Order Total:</span>
                    <span className="text-base font-black text-[#2874F0] dark:text-[#5897ff]">
                      ₹{order.totalAmount}
                    </span>
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

export default OrdersPage;