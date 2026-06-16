import axiosInstance from "../api/axios";
import type { Product } from "../types/Product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/Products");

  return response.data.data;
};

export const searchProducts =
  async (
    search: string,
    pageNumber: number,
    pageSize: number
  ) => {

    const response =
      await axiosInstance.get(
        `/Products/search?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

    return response.data;
};