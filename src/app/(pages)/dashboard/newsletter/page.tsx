import { DashboardNewsletterPage } from "@/src/app/components/pages/Dashboard/Newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Newsletter",
};
export default function Page() {
  return <DashboardNewsletterPage />;
}
