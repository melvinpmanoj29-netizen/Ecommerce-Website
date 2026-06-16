import axiosInstance from "../api/axios";


export const getCategories =
  async () => {

    const response =
      await axiosInstance.get(
        "/Categories"
      );

    return response.data.data;
};

export const createCategory =
  async (category: any) => {

    const response =
      await axiosInstance.post(
        "/Categories",
        category
      );

    return response.data;
};

export const updateCategory =
  async (
    id: number,
    category: any
  ) => {

    const response =
      await axiosInstance.put(
        `/Categories/${id}`,
        category
      );

    return response.data;
};

export const deleteCategory =
  async (id: number) => {

    const response =
      await axiosInstance.delete(
        `/Categories/${id}`
      );

    return response.data;
};

export const getCategoryById =
  async (id: number) => {

    const response =
      await axiosInstance.get(
        `/Categories/${id}`
      );

    return response.data;
};