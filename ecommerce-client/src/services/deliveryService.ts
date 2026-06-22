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