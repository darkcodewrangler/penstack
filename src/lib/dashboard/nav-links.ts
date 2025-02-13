import {
  DASH_NAV_PERMISSIONS,
  NavItemWithoutPermission,
  navPermissionMapping,
  TPermissions,
} from "@/src/types";
import { ElementType } from "react";
import {
  LuCombine,
  LuFileImage,
  LuFileSpreadsheet,
  LuFileStack,
  LuHome,
  LuMail,
  LuMessageSquare,
  LuSettings,
  LuUsers,
} from "react-icons/lu";

export const dashboardNavLinks = [
  {
    icon: LuHome,
    label: "Overview",
    href: "/dashboard/overview",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuFileSpreadsheet,
    label: "Posts",
    href: "/dashboard/posts",
    permission: navPermissionMapping.VIEW_POSTS,
    children: [
      {
        label: "All Posts",
        href: "/dashboard/posts",
        permission: navPermissionMapping.VIEW_POSTS,
      },
      {
        label: "New Post",
        href: "/dashboard/posts/new",
        permission: navPermissionMapping.CREATE_POST,
      },
    ],
  },
  {
    label: "Taxonomies",
    href: "/dashboard/taxonomies",
    icon: LuCombine,
  },
  {
    icon: LuUsers,
    label: "Users",
    href: "/dashboard/users",
    permission: navPermissionMapping.VIEW_USERS,
  },
  {
    icon: LuFileImage,
    label: "Media",
    href: "/dashboard/media",
    permission: navPermissionMapping.VIEW_MEDIA,
  },
  {
    icon: LuMessageSquare,
    label: "Comments",
    href: "/dashboard/comments",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuMail,
    label: "Newsletter",
    href: "/dashboard/newsletter",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuSettings,
    label: "Settings",
    href: "/dashboard/settings",
    permission: navPermissionMapping.VIEW_SETTINGS,
  },
];
const routePermissions = {
  "/dashboard/overview": DASH_NAV_PERMISSIONS.VIEW_DASHBOARD,
  "/dashboard/posts": DASH_NAV_PERMISSIONS.VIEW_POSTS,
  "/dashboard/posts/new": DASH_NAV_PERMISSIONS.CREATE_POST,
  "/dashboard/users": DASH_NAV_PERMISSIONS.VIEW_USERS,
  "/dashboard/media": DASH_NAV_PERMISSIONS.VIEW_MEDIA,
  "/dashboard/settings": DASH_NAV_PERMISSIONS.VIEW_SETTINGS,
  "/dashboard/comments": DASH_NAV_PERMISSIONS.VIEW_COMMENTS,
  "/dashboard/newletters": DASH_NAV_PERMISSIONS.VIEW_DASHBOARD,
} as const;

// Navigation structure without embedded permissions

export const dashboardNavLinks2: NavItemWithoutPermission[] = [
  {
    icon: LuHome,
    label: "Overview",
    href: "/dashboard/overview",
  },
  {
    icon: LuFileSpreadsheet,
    label: "Posts",
    href: "/dashboard/posts",
    children: [
      {
        label: "All Posts",
        href: "/dashboard/posts",
      },
      {
        label: "New Post",
        href: "/dashboard/posts/new",
      },
    ],
  },
  {
    label: "Taxonomies",
    href: "/dashboard/taxonomies",
    icon: LuCombine,
  },
  {
    icon: LuUsers,
    label: "Users",
    href: "/dashboard/users",
  },
  {
    icon: LuFileImage,
    label: "Media",
    href: "/dashboard/media",
  },
  {
    icon: LuMessageSquare,
    label: "Comments",
    href: "/dashboard/comments",
  },
  {
    icon: LuMail,
    label: "Newsletter",
    href: "/dashboard/newsletter",
  },
  {
    icon: LuSettings,
    label: "Settings",
    href: "/dashboard/settings",
  },
];
export const getRoutePermission = (route: string) => {
  return routePermissions[route as keyof typeof routePermissions];
};
export const useDashboardNavigation = (userPermissions: TPermissions[]) => {
  const filterNavLinks = (
    links: NavItemWithoutPermission[]
  ): NavItemWithoutPermission[] => {
    return links.filter((link) => {
      const permission = getRoutePermission(link.href);

      // If no permission required or user has permission
      const hasPermission =
        !permission || userPermissions?.includes(permission);

      // Handle children recursively
      if (link.children) {
        link.children = filterNavLinks(link.children);
        console.log({
          child: link?.children,
        });
        // Show parent if any children are visible
        return link?.children?.length > 0 || hasPermission;
      }

      return hasPermission;
    });
  };

  return filterNavLinks(dashboardNavLinks2);
};
