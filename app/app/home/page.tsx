import { redirect } from "next/navigation";

/** The live site serves the homepage from /app/home; this build serves it at /. */
export default function AppHome() {
  redirect("/");
}
