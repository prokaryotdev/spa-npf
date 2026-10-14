import type { Metadata } from "next";
import { Suspense } from "react";
import OpsMapBoard from "../../../components/OpsMapBoard";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Map | Nigeria Police Force") };
}

// Suspense: the board reads its query string to open a record.
export default function Page() {
  return (
    <Suspense>
      <OpsMapBoard />
    </Suspense>
  );
}
