import axiosInstance from "../api/axios";

export const createProduct = async (
  product: any
) => {

  const response =
    await axiosInstance.post(
      "/Products",
      product
    );

  return response.data;
};


