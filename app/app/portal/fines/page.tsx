import type { Metadata } from "next";
import PortalFines from "../../../components/PortalFines";

export const metadata: Metadata = { title: "Fines | My Dubai Police" };

export default function FinesPage() {
  return <PortalFines />;
}
