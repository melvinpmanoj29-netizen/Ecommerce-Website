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