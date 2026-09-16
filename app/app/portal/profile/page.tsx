import type { Metadata } from "next";
import PortalProfile from "../../../components/PortalProfile";

export const metadata: Metadata = { title: "Profile | My Dubai Police" };

export default function ProfilePage() {
  return <PortalProfile />;
}
