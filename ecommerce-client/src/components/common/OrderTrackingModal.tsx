import type { Order } from "../../types/Order";
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaMotorcycle,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

interface Props {
  order: Order;
  onClose: () => void;
}

// All standard delivery statuses in sequence
const TRACKING_STEPS = [
  {
    key: "Pending",
    label: "Order Confirmed",
    description: "Your order has been confirmed",
    icon: FaCheckCircle,
  },
  {
    key: "Processing",
    label: "Processing",
    description: "Your order is being processed",
    icon: FaBox,
  },
  {
    key: "Shipped",
    label: "Shipped",
    description: "Your order has been shipped",
    icon: FaTruck,
  },
  {
    key: "OutForDelivery",
    label: "Out for Delivery",
    description: "Your order is out for delivery",
    icon: FaMotorcycle,
  },
  {
    key: "Delivered",
    label: "Delivered",
    description: "Your order has been delivered",
    icon: FaCheckCircle,
  },
];

// Cancelled / Return flow steps – shown instead when relevant
const CANCELLED_STEPS = [
  {
    key: "Pending",
    label: "Order Confirmed",
    description: "Your order was placed",
    icon: FaCheckCircle,
  },
  {
    key: "Cancelled",
    label: "Cancelled",
    description: "Your order has been cancelled",
    icon: FaTimes,
  },
];

const RETURN_STEPS = [
  {
    key: "Delivered",
    label: "Delivered",
    description: "Your order was delivered",
    icon: FaCheckCircle,
  },
  {
    key: "ReturnRequested",
    label: "Return Requested",
    description: "Your return has been requested",
    icon: FaBox,
  },
  {
    key: "ReturnApproved",
    label: "Return Approved",
    description: "Your return has been approved",
    icon: FaCheckCircle,
  },
  {
    key: "Refunded",
    label: "Refunded",
    description: "Your refund has been processed",
    icon: FaCheckCircle,
  },
];

const STATUS_ORDER: Record<string, number> = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  OutForDelivery: 3,
  DeliveryVerificationPending: 3,
  Delivered: 4,
  // Return flow
  ReturnRequested: 0,
  ReturnApproved: 1,
  ReturnRejected: 1,
  Refunded: 2,
  // Cancel
  Cancelled: 1,
};

function getStepState(
  stepIndex: number,
  currentIndex: number
): "completed" | "active" | "pending" {
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function isReturnFlow(status: string) {
  return ["ReturnRequested", "ReturnApproved", "ReturnRejected", "Refunded"].includes(status);
}

function isCancelFlow(status: string) {
  return status === "Cancelled";
}

function getExpectedDelivery(createdDate: string) {
  const d = new Date(createdDate);
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrderTrackingModal({ order, onClose }: Props) {
  const status = order.status;

  const steps = isCancelFlow(status)
    ? CANCELLED_STEPS
    : isReturnFlow(status)
    ? RETURN_STEPS
    : TRACKING_STEPS;

  const currentIndex = STATUS_ORDER[status] ?? 0;

  // Figure out timestamps for each step we can infer
  const createdFmt = formatDate(order.createdDate);
  const deliveredFmt = formatDate(order.deliveredAt);

  function getStepDate(stepKey: string) {
    if (stepKey === "Pending" && !isCancelFlow(status) && !isReturnFlow(status))
      return createdFmt;
    if (stepKey === "Delivered") return deliveredFmt;
    return null;
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="bg-theme-card border border-theme rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme">
          <div>
            <h2 className="text-base font-bold text-theme-primary font-outfit">
              Track Order
            </h2>
            <p className="text-xs text-theme-muted mt-0.5">
              Order ID: #{order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-theme-muted transition-colors"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Expected Delivery Banner (only for active delivery orders) */}
        {!isCancelFlow(status) &&
          !isReturnFlow(status) &&
          status !== "Delivered" && (
            <div className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#2874F0]/30 bg-[#2874F0]/5">
              <FaTruck className="text-[#2874F0] shrink-0" size={18} />
              <div>
                <p className="text-[11px] text-theme-muted font-medium">
                  Expected delivery by
                </p>
                <p className="text-sm font-bold text-[#2874F0]">
                  {getExpectedDelivery(order.createdDate)}
                </p>
              </div>
            </div>
          )}

        {/* Timeline */}
        <div className="px-5 py-5">
          <div className="relative">
            {steps.map((step, index) => {
              const state = getStepState(index, currentIndex);
              const IconComponent = step.icon;
              const dateFmt = getStepDate(step.key);
              const isLast = index === steps.length - 1;

              const isCancel = step.key === "Cancelled";
              const isReturnRejected = status === "ReturnRejected" && step.key === "ReturnApproved";

              // Colour logic
              let iconBg = "bg-gray-200 dark:bg-slate-700";
              let iconColor = "text-gray-400 dark:text-slate-500";
              let connectorColor = "bg-gray-200 dark:bg-slate-700";
              let labelColor = "text-theme-muted";
              let descColor = "text-theme-muted";

              if (state === "completed") {
                iconBg = "bg-green-500";
                iconColor = "text-white";
                connectorColor = "bg-green-500";
                labelColor = "text-theme-primary";
                descColor = "text-theme-secondary";
              } else if (state === "active") {
                if (isCancel) {
                  iconBg = "bg-red-500";
                  iconColor = "text-white";
                  connectorColor = "bg-red-400";
                  labelColor = "text-red-500";
                } else if (isReturnRejected) {
                  iconBg = "bg-red-500";
                  iconColor = "text-white";
                  labelColor = "text-red-500";
                } else {
                  iconBg = "bg-[#2874F0]";
                  iconColor = "text-white";
                  connectorColor = "bg-[#2874F0]";
                  labelColor = "text-[#2874F0] dark:text-[#5897ff]";
                }
                descColor = "text-theme-secondary";
              }

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Icon column with connector line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${iconBg}`}
                    >
                      <IconComponent size={15} className={iconColor} />
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 my-1 min-h-[32px] transition-colors duration-300 ${
                          state === "completed" ? connectorColor : "bg-gray-200 dark:bg-slate-700"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content column */}
                  <div className={`pb-5 flex-1 flex justify-between items-start ${isLast ? "" : ""}`}>
                    <div>
                      <p
                        className={`text-sm font-semibold transition-colors duration-200 ${labelColor}`}
                      >
                        {/* Show "ReturnRejected" text override */}
                        {status === "ReturnRejected" && step.key === "ReturnApproved"
                          ? "Return Rejected"
                          : step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${descColor}`}>
                        {status === "ReturnRejected" && step.key === "ReturnApproved"
                          ? "Your return has been rejected"
                          : step.description}
                      </p>
                    </div>

                    {/* Date/Time stamp */}
                    {dateFmt && state !== "pending" && (
                      <div className="text-right shrink-0 ml-4">
                        <p
                          className={`text-xs font-semibold ${
                            state === "active" && !isCancel
                              ? "text-[#2874F0] dark:text-[#5897ff]"
                              : "text-theme-muted"
                          }`}
                        >
                          {dateFmt.date}
                        </p>
                        <p
                          className={`text-xs ${
                            state === "active" && !isCancel
                              ? "text-[#2874F0] dark:text-[#5897ff]"
                              : "text-theme-muted"
                          }`}
                        >
                          {dateFmt.time}
                        </p>
                      </div>
                    )}

                    {/* Dash for future steps */}
                    {!dateFmt && state === "pending" && (
                      <span className="text-xs text-theme-muted ml-4">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info footer */}
        {!isCancelFlow(status) && !isReturnFlow(status) && status !== "Delivered" && (
          <div className="mx-5 mb-5 flex gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
            <FaInfoCircle
              className="text-blue-500 shrink-0 mt-0.5"
              size={14}
            />
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              We are trying our best to deliver your order as soon as possible.
              You will receive a call from our delivery partner before delivery.
            </p>
          </div>
        )}

        {/* Delivered footer */}
        {status === "Delivered" && (
          <div className="mx-5 mb-5 flex gap-3 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40">
            <FaCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
              Your order has been delivered. Thank you for shopping with us!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
