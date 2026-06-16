import axiosInstance from "../api/axios";

export const updateProduct =
  async (
    id: number,
    product: any
  ) => {

    const response =
      await axiosInstance.put(
        `/Products/${id}`,
        product
      );

    return response.data;
};