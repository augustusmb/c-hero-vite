import apiClient from "./apiClient.ts";
import { TSignUpSchema } from "../features/signup/components/SignUpConfig";
import { toast, Bounce } from "react-toastify";

export type FormOptions = {
  companies: Array<{ id: number; name: string }>;
  ports: Array<{ id: number; name: string }>;
  vessels: Array<{ id: number; name: string }>;
};

export const fetchOptions = async (): Promise<FormOptions> => {
  const { data } = await apiClient.get<FormOptions>(`api/public/sign-up`);
  return data;
};

export const checkPhoneAvailable = async (
  phone: string,
): Promise<{ available: boolean }> => {
  const { data } = await apiClient.get<{ available: boolean }>(
    `api/public/sign-up/phone-available`,
    { params: { phone } },
  );
  return data;
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

    return response.data;
  } catch (error: any) {
    // 409 (duplicate) is handled in the form so it can show inline + a login action
    if (error.response?.status !== 409) {
      toast.error(error.response?.data?.error || "Failed to sign up");
    }
    throw error;
  }
};
