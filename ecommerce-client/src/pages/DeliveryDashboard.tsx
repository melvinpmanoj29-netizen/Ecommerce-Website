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

import {
  FaMapMarkerAlt,
  FaPhone,
  FaBox,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendarAlt,
  FaStickyNote,
  FaRupeeSign,
} from "react-icons/fa";

function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [otpInputs, setOtpInputs] = useState<Record<number, string>>({});
  const [loadingOrders, setLoadingOrders] = useState<Record<number, boolean>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

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
    const reason = window.prompt(
      "Please enter the reason for emergency OTP request (e.g. customer phone unavailable):"
    );
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
      const errorMsg =
        err.response?.data?.message || "Failed to request emergency OTP";
      toast.error(errorMsg);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      OutForDelivery: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      DeliveryVerificationPending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return map[status] ?? "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300";
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-xl md:text-2xl font-bold text-theme-primary mb-6 font-outfit">
          My Deliveries ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm">
            <FaBox size={40} className="mx-auto text-theme-muted mb-3" />
            <p className="text-theme-muted font-medium">No assigned deliveries.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const addr = order.shippingAddress;

              return (
                <div
                  key={order.id}
                  className="bg-theme-card border border-theme rounded-md shadow-sm overflow-hidden transition-colors duration-200"
                >
                  {/* ── Clickable header row ── */}
                  <button
                    className="w-full text-left"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-slate-900/40 border-b border-theme/80 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-bold text-theme-primary">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-theme-muted flex items-center gap-1.5 mt-0.5">
                            <FaCalendarAlt size={10} />
                            {new Date(order.createdDate).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Customer name if available */}
                        {addr?.fullName && (
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-theme-muted font-medium">
                            <FaUser size={10} />
                            {addr.fullName}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-sm text-xs font-bold border border-transparent ${getStatusBadge(order.status)}`}
                        >
                          {order.status === "DeliveryVerificationPending"
                            ? "OTP Pending"
                            : order.status}
                        </span>
                        {isExpanded ? (
                          <FaChevronUp size={12} className="text-theme-muted" />
                        ) : (
                          <FaChevronDown size={12} className="text-theme-muted" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* ── Expanded detail panel ── */}
                  {isExpanded && (
                    <div className="divide-y divide-theme/60">
                      {/* Order summary + Address side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-theme/60">
                        {/* Address block */}
                        <div className="p-5">
                          <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <FaMapMarkerAlt size={11} className="text-[#2874F0]" />
                            Delivery Address
                          </h3>

                          {addr ? (
                            <div className="space-y-1.5">
                              <p className="text-sm font-semibold text-theme-primary flex items-center gap-2">
                                <FaUser size={11} className="text-theme-muted shrink-0" />
                                {addr.fullName}
                              </p>
                              <p className="text-xs text-theme-secondary leading-relaxed pl-5">
                                {addr.addressLine1}
                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                                <br />
                                {addr.city}, {addr.state} – {addr.postalCode}
                              </p>
                              <p className="text-xs text-theme-muted flex items-center gap-2 pt-1">
                                <FaPhone size={10} className="text-theme-muted shrink-0" />
                                <a
                                  href={`tel:${addr.phoneNumber}`}
                                  className="text-[#2874F0] hover:underline font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {addr.phoneNumber}
                                </a>
                              </p>
                              {addr.deliveryNotes && (
                                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2 pt-1 bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1.5">
                                  <FaStickyNote size={10} className="shrink-0 mt-0.5" />
                                  <span>{addr.deliveryNotes}</span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-theme-muted italic">
                              No address on file.
                            </p>
                          )}
                        </div>

                        {/* Order details block */}
                        <div className="p-5">
                          <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <FaBox size={11} className="text-[#2874F0]" />
                            Order Details
                          </h3>
                          <div className="space-y-3">
                            {order.items.map((item: any) => (
                              <div
                                key={item.productName}
                                className="flex items-center gap-3"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-11 h-11 object-contain bg-white rounded border border-theme p-0.5 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-theme-primary truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-theme-muted">
                                    Qty: {item.quantity} &nbsp;·&nbsp; ₹{item.price}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-theme-primary shrink-0">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Total */}
                          <div className="mt-4 pt-3 border-t border-theme/60 flex justify-between items-center">
                            <span className="text-xs text-theme-muted font-medium flex items-center gap-1">
                              <FaRupeeSign size={10} /> Order Total
                            </span>
                            <span className="text-sm font-black text-[#2874F0] dark:text-[#5897ff]">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ── Action row ── */}
                      <div className="px-5 py-4 bg-gray-50/50 dark:bg-slate-900/10 flex flex-wrap items-center gap-3 justify-end">
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
                          <div className="flex flex-col gap-2 w-full">
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
                          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
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
                            <span className="px-3 py-1 rounded border border-theme text-sm font-medium text-theme-secondary">
                              {order.status}
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default DeliveryDashboard;