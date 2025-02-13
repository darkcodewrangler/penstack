import { TPermissions } from "@/src/types";
import { objectToQueryParams } from "@/src/utils";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
export class ClientPermissionHandler {
  static async getPermissions() {
    return queryClient.fetchQuery({
      queryKey: ["permissions"],
      queryFn: async () => {
        try {
          const response = await fetch(`/api/auth/get-permissions`);
          if (!response.ok) {
            throw new Error("Failed to fetch permissions");
          }
          const data = (await response.json()) as {
            data: { permissions: TPermissions[] };
          };
          return data?.data;
        } catch (error) {
          return { permissions: [] };
        }
      },
    });
  }
  static async checkPermission({
    requiredPermission,
    email,
    appendSiteUrl = false,
  }: {
    requiredPermission: TPermissions;
    appendSiteUrl?: boolean;
    email?: string;
  }) {
    const apiUrl = appendSiteUrl
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/check-permission`
      : `/api/auth/check-permission`;
    return queryClient.fetchQuery({
      queryKey: ["permission", requiredPermission, email],
      queryFn: async () => {
        try {
          const response = await fetch(
            `${apiUrl}?${objectToQueryParams({ permission: requiredPermission, email })}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch check permission");
          }
          const data = (await response.json()) as {
            data: { hasPermission: boolean; permissions: TPermissions[] };
          };

          return data?.data;
        } catch (error) {
          return { permissions: [], hasPermission: false };
        }
      },
    });
  }
  static async checkPermissionAndThrow(requiredPermission: TPermissions) {
    const { hasPermission } = await ClientPermissionHandler.checkPermission({
      requiredPermission,
    });
    if (!hasPermission) {
      throw new Error("Permission denied");
    }
  }
  static async checkPermissionAndReturn(requiredPermission: TPermissions) {
    const { hasPermission } = await ClientPermissionHandler.checkPermission({
      requiredPermission,
    });
    return hasPermission;
  }
}
