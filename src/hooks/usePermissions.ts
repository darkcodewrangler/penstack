import { TPermissions } from "../types";
import { usePermissionsStore } from "../state/permissions";

export const usePermissions = (requiredPermission: TPermissions) => {
  const permissions = usePermissionsStore((state) => state.permissions);
  const isLoading = usePermissionsStore((state) => state.isLoading);
  let hasPermission: boolean = false;
  if (permissions?.length) {
    const found = permissions.find(
      (permission) => permission === requiredPermission
    );
    hasPermission = !!found;
  }
  return { hasPermission, loading: isLoading };
};
