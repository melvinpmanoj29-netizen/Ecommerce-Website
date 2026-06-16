
import axiosInstance from "../api/axios";

export const addToCart = async (
  productId: number,
  quantity: number
) => {
  const response =
    await axiosInstance.post(
      "/Cart/add",
      {
        productId,
        quantity
      });

  return response.data;
};
export const getCart =
  async () => {

    const response =
      await axiosInstance.get(
        "/Cart");

    return response.data.data;
};

export const updateCart =
  async (
    cartItemId: number,
    quantity: number
  ) => {

    await axiosInstance.put(
      "/Cart/update",
      {
        cartItemId,
        quantity
      }
    );
};

export const removeCartItem =
  async (
    cartItemId: number
  ) => {

    await axiosInstance.delete(
      `/Cart/${cartItemId}`
    );
};