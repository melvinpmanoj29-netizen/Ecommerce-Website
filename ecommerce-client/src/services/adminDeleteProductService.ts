import axiosInstance from "../api/axios";

export const deleteProduct =
  async (id: number) => {

    const response =
      await axiosInstance.delete(
        `/Products/${id}`
      );

    return response.data;
};