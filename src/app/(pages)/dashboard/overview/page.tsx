import Overview from "@/src/app/components/pages/Dashboard/Overview";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Overview",
};
export default function Page() {
  return (
    <PermissionGuard requiredPermission={"dashboard:view"} shouldRedirect>
      <Overview />
    </PermissionGuard>
  );
}
