import type { Metadata } from "next";
import { Suspense } from "react";
import OpsCustody from "../../../components/OpsCustody";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Custody | Nigeria Police Force") };
}

// Suspense: the board reads its query string to open a record.
export default function Page() {
  return (
    <Suspense>
      <OpsCustody />
    </Suspense>
  );
}
