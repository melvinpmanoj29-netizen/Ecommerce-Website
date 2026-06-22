import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/buttons/Button";
import {
  getEmergencyDeliveries,
  approveEmergencyOtp,
} from "../../services/adminEmergencyService";

interface EmergencyDelivery {
  orderId: number;
  customerName: string;
  customerEmail: string;
  deliveryAgentName: string;
  currentStatus: string;
  requestTimestamp: string | null;
  requestReason: string;
  isApproved: boolean;
}

function AdminEmergencyDeliveriesPage() {
  const [requests, setRequests] = useState<EmergencyDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState<Record<number, boolean>>({});

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getEmergencyDeliveries();
      setRequests(data);
    } catch (err: any) {
      toast.error("Failed to load emergency delivery requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (orderId: number) => {
    setApprovingIds((prev) => ({ ...prev, [orderId]: true }));
    try {
      await approveEmergencyOtp(orderId);
      toast.success(`Emergency OTP sent to customer for Order #${orderId}`);
      await loadRequests();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to approve emergency OTP";
      toast.error(errorMsg);
    } finally {
      setApprovingIds((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const pendingCount = requests.filter((r) => !r.isApproved).length;
  const approvedCount = requests.filter((r) => r.isApproved).length;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-theme pb-5">
          <div className="w-11 h-11 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-2xl shadow-sm">
            🚨
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-theme-primary font-outfit">
              Emergency Delivery Requests
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">
              Review and approve delivery agent emergency OTP override requests
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-md p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-red-600 dark:text-red-400">
              {pendingCount}
            </p>
            <p className="text-xs font-semibold text-red-700 dark:text-red-500 uppercase tracking-wide mt-1">
              Pending
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-md p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-green-600 dark:text-green-400">
              {approvedCount}
            </p>
            <p className="text-xs font-semibold text-green-700 dark:text-green-500 uppercase tracking-wide mt-1">
              Approved
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-theme-card border border-theme rounded-md shadow-sm">
            <span className="text-5xl">✅</span>
            <h2 className="text-lg font-semibold text-theme-primary mt-4 mb-1">
              No Emergency Requests
            </h2>
            <p className="text-sm text-theme-muted">
              All delivery verifications are proceeding normally.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending first, then approved */}
            {[...requests]
              .sort((a, b) => {
                if (a.isApproved !== b.isApproved)
                  return a.isApproved ? 1 : -1;
                return 0;
              })
              .map((req) => (
                <div
                  key={req.orderId}
                  className={`rounded-md border shadow-sm overflow-hidden transition-all duration-200 ${
                    req.isApproved
                      ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/40"
                      : "bg-theme-card border-red-200 dark:border-red-900/50"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`px-5 py-3 border-b flex items-center justify-between gap-3 ${
                      req.isApproved
                        ? "border-green-200 dark:border-green-900/40 bg-green-100/50 dark:bg-green-950/20"
                        : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-black ${
                          req.isApproved
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        Order #{req.orderId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                          req.isApproved
                            ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                        }`}
                      >
                        {req.isApproved ? "✓ Approved" : "⚠ Pending"}
                      </span>
                    </div>
                    {req.requestTimestamp && (
                      <span className="text-xs text-theme-muted font-medium">
                        Requested:{" "}
                        {new Date(req.requestTimestamp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">
                        Customer Details
                      </p>
                      <p className="text-sm font-semibold text-theme-primary">
                        {req.customerName}
                      </p>
                      <p className="text-xs text-theme-muted">
                        {req.customerEmail}
                      </p>
                    </div>

                    {/* Agent Info */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">
                        Delivery Agent
                      </p>
                      <p className="text-sm font-semibold text-theme-primary">
                        {req.deliveryAgentName}
                      </p>
                      <p className="text-xs text-theme-muted">
                        Order Status:{" "}
                        <span className="font-medium text-theme-primary">
                          {req.currentStatus}
                        </span>
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">
                        Request Reason
                      </p>
                      <div className="bg-theme-body border border-theme rounded px-4 py-3 text-sm text-theme-primary italic">
                        "{req.requestReason}"
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  {!req.isApproved && (
                    <div className="px-5 py-4 border-t border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10 flex justify-end">
                      <Button
                        variant="danger"
                        onClick={() => handleApprove(req.orderId)}
                        disabled={approvingIds[req.orderId]}
                        className="text-sm px-5 py-2"
                      >
                        {approvingIds[req.orderId]
                          ? "Sending OTP..."
                          : "🔑 Send Emergency OTP"}
                      </Button>
                    </div>
                  )}
                  {req.isApproved && (
                    <div className="px-5 py-3 border-t border-green-200 dark:border-green-900/40 bg-green-50/40 dark:bg-green-950/10 flex justify-end">
                      <span className="text-xs text-green-700 dark:text-green-400 font-semibold flex items-center gap-1.5">
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
                        Emergency OTP sent to customer
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminEmergencyDeliveriesPage;
