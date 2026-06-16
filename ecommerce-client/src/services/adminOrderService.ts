import axiosInstance from "../api/axios";

export const getAllOrders =
  async () => {

    const response =
      await axiosInstance.get(
        "/Orders/admin"
      );

    return response.data.data;
};

export const updateOrderStatus =
  async (
    id: number,
    status: string
  ) => {

    const response =
      await axiosInstance.put(
        `/Orders/${id}/status?status=${status}`
      );

    return response.data;
};