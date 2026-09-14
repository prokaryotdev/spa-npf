"use client";

import Link from "next/link";
import { deployment } from "../content-ops";
import OpsResponseChart from "./OpsResponseChart";
import { IncidentRow, OpsPanel } from "./OpsPieces";
import { useStore } from "./store";
import { ArrowRight } from "./icons";

export default function OpsOverview() {
  const { incidents, requests } = useStore();

  const live = incidents.filter((i) => i.status !== "Closed");
  const unassigned = live.filter((i) => !i.assignee);
  const critical = live.filter((i) => i.priority === "Critical");
  const pending = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Rejected",
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-secondary text-2xl font-bold">Operations</h1>
        <p className="mt-1 text-sm text-[var(--ops-dim)]">
          {live.length} live · {unassigned.length} unassigned ·{" "}
          {critical.length} critical · {pending.length} service requests waiting
        </p>
      </header>

      {/* items-start so the queue panel is as tall as its rows, not as tall
          as the two stacked panels beside it. */}
      <div className="grid items-start gap-4 xl:grid-cols-[1fr_340px]">
        <OpsPanel
          title="Live queue"
          action={
            <Link
              href="/app/police/incidents"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ops-accent)] transition-opacity hover:opacity-80"
            >
              All incidents
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          }
        >
          {live.length ? (
            <ul className="divide-y divide-[var(--ops-line)]">
              {live.slice(0, 6).map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-[var(--ops-dim)]">
              Nothing live. Every incident on the board is closed.
            </p>
          )}
        </OpsPanel>

        <div className="space-y-4">
          <OpsPanel title="Deployment">
            <table className="w-full text-sm">
              <caption className="sr-only">Units on duty, by division</caption>
              <thead className="text-xs text-[var(--ops-dim)]">
                <tr>
                  <th scope="col" className="pb-2 text-left font-medium">
                    Division
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    On duty
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Free
                  </th>
                </tr>
              </thead>
              <tbody>
                {deployment.map((row) => (
                  <tr
                    key={row.division}
                    className="border-t border-[var(--ops-line)]"
                  >
                    <th scope="row" className="py-2 text-left font-normal">
                      {row.division}
                    </th>
                    <td className="py-2 text-right tabular-nums">
                      {row.onDuty}
                    </td>
                    <td
                      className={`py-2 text-right tabular-nums ${
                        row.available === 0
                          ? "text-[#f0b354]"
                          : "text-[var(--ops-accent)]"
                      }`}
                    >
                      {row.available}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OpsPanel>

          <OpsPanel>
            <OpsResponseChart />
          </OpsPanel>
        </div>
      </div>
    </div>
  );
}
