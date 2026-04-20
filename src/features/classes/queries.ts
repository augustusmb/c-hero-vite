import { queryOptions } from "@tanstack/react-query";
import { DashboardParams, getDashboardUsers } from "../../api/user.ts";

export const classesKeys = {
  all: ["classes"] as const,
  dashboard: (params: DashboardParams) =>
    [...classesKeys.all, "dashboard", params] as const,
};

export const dashboardUsersQuery = (params: DashboardParams) =>
  queryOptions({
    queryKey: classesKeys.dashboard(params),
    queryFn: () => getDashboardUsers(params),
    enabled: Boolean(params.vessel_id),
  });
