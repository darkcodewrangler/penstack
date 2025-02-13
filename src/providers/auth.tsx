"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePermissionsStore } from "../state/permissions";
import { useQuery } from "@tanstack/react-query";
import { TPermissions } from "../types";
import { objectToQueryParams } from "../utils";
import { useEffect } from "react";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const setPermissions = usePermissionsStore((state) => state.setPermissions);
  const setIsLoading = usePermissionsStore((state) => state.setIsLoading);
  const { isPending, data } = useQuery({
    queryKey: ["permissions", session?.user?.email],
    enabled: !!session?.user?.email,

    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/auth/get-permissions?${objectToQueryParams({ email: session?.user?.email })}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }
        const data = (await response.json()) as {
          data: { permissions: TPermissions[] };
        };

        return data?.data?.permissions;
      } catch (error) {
        return { permissions: [] };
      }
    },
  });

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);
  useEffect(() => {
    setPermissions(data as TPermissions[]);
  }, [data]);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
