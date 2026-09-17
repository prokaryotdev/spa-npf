import { redirect } from "next/navigation";
import { localePath } from "../../i18n/path";
import { getLang } from "../../i18n/server";

/**
 * The live site serves the homepage from /app/home; this build serves it at /.
 *
 * The language has to be carried across by hand: a bare redirect("/") sends
 * the visitor to a URL naming no language, and proxy.ts would then have to
 * guess one — landing an Hausa reader on the English homepage whenever the
 * cookie is missing, which is exactly the case for a crawler.
 */
export default async function AppHome() {
  redirect(localePath("/", await getLang()));
}
