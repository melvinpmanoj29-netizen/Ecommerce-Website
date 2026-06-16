import axiosInstance from "../api/axios";

export const getUsers =
  async () => {

    const response =
      await axiosInstance.get(
        "/Users"
      );

    return response.data.data;
};

export const deleteUser =
  async (id: number) => {

    const response =
      await axiosInstance.delete(
        `/Users/${id}`
      );

    return response.data;
};

export const updateUserRole =
  async (
    id: number,
    role: string
  ) => {

    const response =
      await axiosInstance.put(
        `/Users/${id}/role?role=${role}`
      );

    return response.data;
};