import api from "../api/axios";

export const getEmergencyDeliveries = async () => {
  const response = await api.get("/admin/emergency-deliveries");
  return response.data.data;
};

export const approveEmergencyOtp = async (orderId: number) => {
  const response = await api.post(`/orders/${orderId}/approve-emergency-otp`);
  return response.data;
};
