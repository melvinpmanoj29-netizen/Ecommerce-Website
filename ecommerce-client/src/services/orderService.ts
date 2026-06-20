import axiosInstance from "../api/axios";

export const getOrders =
  async () => {

    const response =
      await axiosInstance.get(
        "/Orders"
      );

    return response.data.data;
};

export const checkout =
  async () => {

    const response =
      await axiosInstance.post(
        "/Orders"
      );

    return response.data;
};

export const cancelOrder = async (orderId: number) => {
  const response = await axiosInstance.post(
    `/Orders/${orderId}/cancel`
  );

  return response.data;
};

export const requestReturn = async (orderId: number) => {
  const response = await axiosInstance.post(
    `/Orders/${orderId}/request-return`
  );

  return response.data;
};