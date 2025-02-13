import "server-only";
import { db } from "@/src/db";
import { users } from "@/src/db/schemas";
import { TPermissions } from "@/src/types";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const cachedGetUserPermissions = unstable_cache(
  async (email: string): Promise<TPermissions[]> => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.role) return [];

    const userPermissions = Array.from(
      new Set(user.role.permissions.map((rp) => rp.permission.name))
    );

    return userPermissions;
  },
  ["getUserPermissions"],
  {
    revalidate: false, // Disable time-based revalidation
    tags: ["getUserPermissions"],
  }
);

export const getUserPermissions = cachedGetUserPermissions;
