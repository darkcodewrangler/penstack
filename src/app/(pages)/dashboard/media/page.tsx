import DashboardMediaPage from "@/src/app/components/pages/Dashboard/Medias";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Medias",
};
export default function Page() {
  return (
    <PermissionGuard requiredPermission={"media:read"} shouldRedirect>
      <DashboardMediaPage />
    </PermissionGuard>
  );
}
