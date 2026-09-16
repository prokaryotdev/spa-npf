import type { Metadata } from "next";
import PortalRequests from "../../../components/PortalRequests";

export const metadata: Metadata = { title: "My Requests | My Dubai Police" };

export default function RequestsPage() {
  return <PortalRequests />;
}
