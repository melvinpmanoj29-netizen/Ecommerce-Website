import axiosInstance from "../api/axios";

export const checkout = async () => {
  const response =
    await axiosInstance.post(
      "/Payments/checkout"
    );

  return response.data.url;
};

export const checkoutSuccess =
  async () => {
    const response =
      await axiosInstance.post(
        "/Orders"
      );

    return response.data;
  };

