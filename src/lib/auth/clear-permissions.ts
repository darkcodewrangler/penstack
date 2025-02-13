import "server-only";

import { revalidateTag } from "next/cache";

export const clearUserPermissionsCache = (email: string) => {
  revalidateTag(`getUserPermissions-${email}`);
};
