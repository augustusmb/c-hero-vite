import apiClient from "./apiClient.ts";
import { UserType } from "../types/types.ts";
import { ClassProgress } from "../features/classes/types.ts";
import { FormattedUserFormData } from "../features/admin/types.ts";
import { UpdatedUserInfo } from "../features/user/types.ts";

export type SerialNumber = {
  product_id: string;
  serial_number: string;
  user_id: number;
};

export type DashboardParams = {
  id?: number;
  vessel_id?: number;
  company?: string;
};

export type VesselDashboardData = {
  vesselName: string;
  usersWithProductProgressMaps: any[];
};

export const fetchUserClasses = async (
  userId: number,
): Promise<ClassProgress[]> => {
  const { data } = await apiClient.get<ClassProgress[]>(
    "api/routes/classes",
    { params: { userId } },
  );
  return data;
};

export const getUserByPhone = async (phone: string): Promise<UserType[]> => {
  const { data } = await apiClient.get<UserType[]>("api/routes/users", {
    params: { phone },
  });
  return data;
};

export const listUsers = async (): Promise<UserType[]> => {
  const { data } = await apiClient.get<UserType[]>(
    "api/routes/fetch-all-users",
  );
  return data;
};

export const updateUserInfo = async (updatedUserInfo: UpdatedUserInfo) => {
  const { data } = await apiClient.put("api/routes/users", {
    params: updatedUserInfo,
  });
  return data;
};

export const updateUserInfoAndProducts = async (
  updatedUserInfoProducts: FormattedUserFormData,
) => {
  const { data } = await apiClient.put("api/routes/users-products", {
    params: updatedUserInfoProducts,
  });
  return data;
};

export const deleteUser = async (userId: number) => {
  const { data } = await apiClient.delete("api/routes/users", {
    params: { userId },
  });
  return data;
};

export const getDashboardUsers = async (
  params: DashboardParams,
): Promise<VesselDashboardData> => {
  const { data } = await apiClient.get<VesselDashboardData>(
    "api/routes/dashboard",
    { params },
  );
  return data;
};

export const getSerialNumbers = async (
  userId: number,
): Promise<SerialNumber[]> => {
  const { data } = await apiClient.get<SerialNumber[]>(
    "api/routes/product-serial-numbers",
    { params: { userId } },
  );
  return data;
};

export const deleteSerialNumber = async ({
  userId,
  serialNumber,
}: {
  userId: number;
  serialNumber: string;
}) => {
  const { data } = await apiClient.delete("api/routes/product-serial-numbers", {
    params: { userId, serialNumber },
  });
  return data;
};

export const addSerialNumber = async ({
  userId,
  serialNumber,
}: {
  userId: number;
  serialNumber: string;
}) => {
  const { data } = await apiClient.post("api/routes/product-serial-numbers", {
    userId,
    serialNumber,
  });
  return data;
};
