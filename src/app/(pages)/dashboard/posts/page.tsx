import PostsDashboard from "@/src/app/components/pages/Dashboard/AllPosts";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | All Posts",
};
export default function Page() {
  return (
    <PermissionGuard requiredPermission={"posts:read"}>
      <PostsDashboard />
    </PermissionGuard>
  );
}
