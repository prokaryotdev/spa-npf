import type { Metadata } from "next";
import OpsRequests from "../../../components/OpsRequests";

export const metadata: Metadata = { title: "Service requests | Dubai Police" };

export default function OpsRequestsPage() {
  return <OpsRequests />;
}
