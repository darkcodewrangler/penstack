import { withAuth } from "next-auth/middleware";
import { ClientPermissionHandler } from "./lib/auth/client-permission-handler";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false;
      return ClientPermissionHandler.checkPermission({
        requiredPermission: "dashboard:access",
        email: token?.email || "",
        appendSiteUrl: true,
      }).then((res) => res.hasPermission);
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
