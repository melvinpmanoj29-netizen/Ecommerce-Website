import axiosInstance from "../api/axios";
import type { Product } from "../types/Product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/Products");
    console.log("Products API response:", response.data);

  return response.data.data;
};

export const searchProducts = async (
  search: string,
  pageNumber: number,
  pageSize: number,
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const params = new URLSearchParams();

  params.set("search", search);
  params.set("pageNumber", String(pageNumber));
  params.set("pageSize", String(pageSize));

  if (categoryId) {
    params.set("categoryId", categoryId);
  }

  if (minPrice !== undefined) {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice !== undefined) {
    params.set("maxPrice", String(maxPrice));
  }

  const response = await axiosInstance.get(
    `/Products/search?${params.toString()}`
  );

  return response.data;
};