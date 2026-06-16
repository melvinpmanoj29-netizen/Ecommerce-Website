import axiosInstance from "../api/axios";

export const getReviews =
  async (productId: number) => {

    const response =
      await axiosInstance.get(
        `/Reviews/product/${productId}`
      );

    return response.data.data;
};

export const createReview =
  async (
    productId: number,
    rating: number,
    comment: string
  ) => {

    const response =
      await axiosInstance.post(
        "/Reviews",
        {
          productId,
          rating,
          comment
        }
      );

    return response.data;
};