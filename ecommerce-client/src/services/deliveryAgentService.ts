import api from "../api/axios";

export const getDeliveryAgents = async () => {
  const response = await api.get("/users/delivery-agents");
  return response.data.data;
};

export const assignDeliveryAgent = async (
  orderId: number,
  deliveryAgentId: number
) => {
  await api.post(
    `/orders/${orderId}/assign-delivery-agent?deliveryAgentId=${deliveryAgentId}`
  );
};