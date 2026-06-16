import axiosInstance from "../api/axios";

export const getAdminProducts = async () => {
  const response =
    await axiosInstance.get(
      "/Products"
    );

  return response.data.data;
};