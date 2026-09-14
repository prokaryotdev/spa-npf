import type { Metadata } from "next";
import PortalDocuments from "../../../components/PortalDocuments";

export const metadata: Metadata = { title: "Documents | My Dubai Police" };

export default function DocumentsPage() {
  return <PortalDocuments />;
}
