import apiClient from "./apiClient.ts";
import { TSignUpSchema } from "../components/SignUpForm/SignUpConfig.ts";
import { toast, Bounce } from "react-toastify";

export const fetchOptions = async () => {
  const signUpFormOptions = await apiClient.get(`api/public/sign-up`);

  return signUpFormOptions;
};

export const signUpUser = async (signUpUserData: TSignUpSchema) => {
  try {
    const response = await apiClient.post(`api/public/sign-up`, {
      data: signUpUserData,
    });

    if (response.status === 201) {
      toast.success("🎉 Successfully signed up! Welcome aboard!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      });
    }

    return response;
  } catch (error: any) {
    toast.error(error.response?.data?.error || "Failed to sign up");
    throw error;
  }
};
