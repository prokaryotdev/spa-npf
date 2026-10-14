import type { Metadata } from "next";
import { Suspense } from "react";
import OpsCases from "../../../components/OpsCases";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Case files | Nigeria Police Force") };
}

// Suspense: the board reads its query string to open a record.
export default function Page() {
  return (
    <Suspense>
      <OpsCases />
    </Suspense>
  );
}
