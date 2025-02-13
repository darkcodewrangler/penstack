import { ReactNode } from "react";

import DashboardLayout from "../../components/pages/Dashboard/Layout";

export default function DashLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
