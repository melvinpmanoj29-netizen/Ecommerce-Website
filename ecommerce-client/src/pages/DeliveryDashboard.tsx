import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";
import Button from "../components/buttons/Button";

import {
  getAssignedOrders,
  startDelivery,
  requestDeliveryOtp,
  verifyDeliveryOtp,
  requestEmergencyOtp,
} from "../services/deliveryService";

function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [otpInputs, setOtpInputs] = useState<Record<number, string>>({});
  const [loadingOrders, setLoadingOrders] = useState<Record<number, boolean>>({});

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

  const handleStartDelivery = async (orderId: number) => {
    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      await startDelivery(orderId);
      toast.success("Delivery started!");
      await loadOrders();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to start delivery";
      toast.error(errorMsg);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleConfirmDelivery = async (orderId: number) => {
    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      await requestDeliveryOtp(orderId);
      toast.success("Verification OTP sent to customer!");
      await loadOrders();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to request OTP";
      toast.error(errorMsg);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleVerifyOtp = async (orderId: number) => {
    const otp = otpInputs[orderId];
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      await verifyDeliveryOtp(orderId, otp);
      toast.success("Order delivered successfully!");
      // Clear OTP input for this order
      setOtpInputs((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      await loadOrders();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "OTP verification failed";
      toast.error(errorMsg);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleRequestEmergencyOtp = async (orderId: number) => {
    const reason = window.prompt("Please enter the reason for emergency OTP request (e.g. customer phone unavailable):");
    if (reason === null) return;
    
    if (!reason.trim()) {
      toast.error("A reason is required to request emergency OTP");
      return;
    }

    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      await requestEmergencyOtp(orderId, reason);
      toast.success("Emergency OTP request submitted to admin!");
      await loadOrders();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to request emergency OTP";
      toast.error(errorMsg);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
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

                <div className="flex items-center gap-4">
                  {order.status === "Shipped" && (
                    <Button
                      variant="primary"
                      onClick={() => handleStartDelivery(order.id)}
                      disabled={loadingOrders[order.id]}
                    >
                      Start Delivery
                    </Button>
                  )}

                  {order.status === "OutForDelivery" && (
                    <Button
                      variant="accent"
                      onClick={() => handleConfirmDelivery(order.id)}
                      disabled={loadingOrders[order.id]}
                    >
                      Confirm Delivery
                    </Button>
                  )}

                  {order.status === "DeliveryVerificationPending" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-theme-body border border-theme rounded-md p-2 shadow-sm">
                        <input
                          type="text"
                          placeholder="6-Digit OTP"
                          maxLength={6}
                          value={otpInputs[order.id] || ""}
                          onChange={(e) =>
                            setOtpInputs({
                              ...otpInputs,
                              [order.id]: e.target.value,
                            })
                          }
                          className="px-3 py-1.5 border border-theme rounded bg-transparent text-sm w-36 text-center tracking-widest font-semibold focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
                        />
                        <Button
                          variant="primary"
                          className="px-4 py-1.5 text-xs font-semibold"
                          onClick={() => handleVerifyOtp(order.id)}
                          disabled={loadingOrders[order.id]}
                        >
                          Verify OTP
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3 py-1.5 text-xs font-semibold"
                          onClick={() => handleConfirmDelivery(order.id)}
                          disabled={loadingOrders[order.id]}
                        >
                          Resend OTP
                        </Button>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRequestEmergencyOtp(order.id)}
                          disabled={loadingOrders[order.id]}
                          className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          ⚠️ Need Help? Request Emergency OTP Override
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === "Delivered" && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delivered
                    </span>
                  )}

                  {order.status !== "Shipped" &&
                    order.status !== "OutForDelivery" &&
                    order.status !== "DeliveryVerificationPending" &&
                    order.status !== "Delivered" && (
                      <span className="px-3 py-1 rounded border border-theme text-sm font-medium">
                        {order.status}
                      </span>
                    )}
                </div>
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