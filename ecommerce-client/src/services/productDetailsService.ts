import axiosInstance from "../api/axios";

export const getProductById =
  async (id: number) => {

    const response =
      await axiosInstance.get(
        `/Products/${id}`);

   return response.data;
   
};