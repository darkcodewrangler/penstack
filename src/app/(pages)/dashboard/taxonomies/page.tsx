import DashboardTaxonomyPage from "@/src/app/components/pages/Dashboard/Taxonomies";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Taxonomies",
};
export default function Page() {
  return <DashboardTaxonomyPage />;
}
