import axiosInstance from "../api/axios";

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post("/Auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const response = await axiosInstance.post("/Auth/reset-password", {
    email,
    token,
    newPassword,
  });
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await axiosInstance.post(
    "/Auth/google-login",
    { idToken }
  );

  return response.data;
};

export const googleRegister = async (idToken: string) => {
  const response = await axiosInstance.post(
    "/Auth/google-register",
    { idToken }
  );

  return response.data;
};
