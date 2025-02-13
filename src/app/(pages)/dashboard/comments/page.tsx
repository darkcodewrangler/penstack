import CommentsPage from "@/src/app/components/pages/Dashboard/Comments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Comments",
};
export default function Page() {
  return <CommentsPage />;
}
