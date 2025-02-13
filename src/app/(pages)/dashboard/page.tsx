import { getUserPermissions } from "@/src/lib/auth/permissions";
import { getSession } from "@/src/lib/auth/next-auth";
import { redirect } from "next/navigation";

const navPermissionMapping = {
  VIEW_DASHBOARD: "dashboard:view",
  VIEW_POSTS: "posts:read",
  CREATE_POST: "posts:create",
  VIEW_USERS: "users:read",
  VIEW_MEDIA: "media:read",
  VIEW_SETTINGS: "settings:read",
} as const;

const navItems = [
  {
    href: "/dashboard/overview",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    href: "/dashboard/posts",
    permission: navPermissionMapping.VIEW_POSTS,
  },
  {
    href: "/dashboard/posts/new",
    permission: navPermissionMapping.CREATE_POST,
  },

  {
    href: "/dashboard/users",
    permission: navPermissionMapping.VIEW_USERS,
  },
  {
    href: "/dashboard/media",
    permission: navPermissionMapping.VIEW_MEDIA,
  },
  {
    href: "/dashboard/newsletter",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    href: "/dashboard/settings",
    permission: navPermissionMapping.VIEW_SETTINGS,
  },
];

export default async function Page() {
  // const session = await getSession();

  // const permissions = await getUserPermissions(session?.user.email || "");
  // const firstAccessiblePage =
  //   navItems.find((item) => permissions.includes(item.permission))?.href || "/";

  return redirect("/dashboard/overview");
}
