import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const authState = useMemo(() => {
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    return {
      user: session?.user,
      status,
      isAuthenticated,
      isLoading,
    };
  }, [session, status]);

  return authState;
};
