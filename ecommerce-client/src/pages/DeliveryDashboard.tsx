import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import {
  getAssignedOrders,
  updateDeliveryStatus,
} from "../services/deliveryService";

function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const data = await getAssignedOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: number,
    status: string
  ) => {
    try {
      await updateDeliveryStatus(orderId, status);

      toast.success("Status updated");

      loadOrders();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          My Deliveries
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-theme-card border border-theme rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Order #{order.id}
                  </h2>

                  <p className="text-theme-muted">
                    {new Date(
                      order.createdDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="border border-theme rounded px-3 py-2 bg-theme-body"
                >
                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="OutForDelivery">
                    Out For Delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>
                </select>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.productName}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div>
                      <p className="font-semibold">
                        {item.productName}
                      </p>

                      <p className="text-theme-muted">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-theme-muted">
              No assigned deliveries.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default DeliveryDashboard;