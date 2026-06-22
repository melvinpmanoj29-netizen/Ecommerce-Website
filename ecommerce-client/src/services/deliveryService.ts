import api from "../api/axios";

export const getAssignedOrders = async () => {
  const response = await api.get("/orders/delivery");
  return response.data.data;
};

export const updateDeliveryStatus = async (
  orderId: number,
  status: string
) => {
  await api.put(
    `/orders/${orderId}/delivery-status?status=${status}`
  );
};

export const startDelivery = async (orderId: number) => {
  await api.post(`/orders/${orderId}/start-delivery`);
};

export const requestDeliveryOtp = async (orderId: number) => {
  await api.post(`/orders/${orderId}/request-delivery-otp`);
};

export const verifyDeliveryOtp = async (orderId: number, otp: string) => {
  await api.post(`/orders/${orderId}/verify-delivery-otp`, { otp });
};

export const requestEmergencyOtp = async (orderId: number, reason: string) => {
  await api.post(`/orders/${orderId}/request-emergency-otp`, { reason });
};