import DashboardSettingsPage from "@/src/app/components/pages/Dashboard/Settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Settings",
};
export default function Page() {
  return <DashboardSettingsPage />;
}
