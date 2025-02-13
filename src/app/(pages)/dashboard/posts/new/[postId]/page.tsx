import NewPostPage from "@/src/app/components/pages/Dashboard/NewPostPage";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Create Post",
};
export default function Page() {
  return (
    <PermissionGuard requiredPermission={"posts:create"}>
      <NewPostPage />;
    </PermissionGuard>
  );
}
