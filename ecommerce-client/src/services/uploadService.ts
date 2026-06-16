import axiosInstance from "../api/axios";

export const uploadImage =
  async (file: File) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axiosInstance.post(
        "/Upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return response.data.data;
};