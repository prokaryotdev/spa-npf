"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { Incident, Unit } from "./store";
import { pinOf } from "../geo";
import { useT } from "../i18n/client";

const GRADE: Record<Incident["priority"], string> = {
  P1: "var(--ops-p1)",
  P2: "var(--ops-p2)",
  P3: "var(--ops-p3)",
  P4: "var(--ops-p4)",
};

const UNIT: Record<Unit["status"], string> = {
  Available: "var(--ops-ok)",
  Assigned: "var(--ops-route)",
  "On Scene": "var(--ops-scene)",
  Unavailable: "var(--color-npf-steel)",
};

const UNIT_WORD: Record<Unit["status"], string> = {
  Available: "Available",
  Assigned: "En route",
  "On Scene": "On scene",
  Unavailable: "Off the air",
};

/** Nigeria, framed: the national view before any call sets the frame. */
const NIGERIA: [[number, number], [number, number]] = [
  [4.2, 2.7],
  [13.9, 14.7],
];

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export type MapLayers = { calls: boolean; units: boolean; history: boolean };

/**
 * The live picture: open calls as grade-coloured pins, units as dots in their
 * status colour, and, when asked, where the shift's closed calls happened.
 *
 * A pin drawn from the record's own coordinates is solid. A record that only
 * knows its state sits on the command's headquarters as a hollow ring, so
 * nobody drives to a dot the map made up.
 *
 * Leaflet is loaded in the browser only, after mount: it reads `window` on
 * import, and the console never renders a map on the server.
 *
 * ponytail: Esri's keyless Light Gray Canvas tiles. Production needs an
 * ArcGIS licence or a self-hosted tile server, and NIPOST/OSGOF street data
 * where it is better than OpenStreetMap's.
 */
export default function OpsMap({
  incidents,
  units,
  focus,
  onPick,
  layers = { calls: true, units: true, history: false },
  compact = false,
  label,
}: {
  incidents: Incident[];
  units: Unit[];
  /** A call id or a unit callsign to light up and bring into view. */
  focus?: string | null;
  onPick?: (id: string) => void;
  layers?: MapLayers;
  /** A small map in a panel: no wheel zoom, tighter frame. */
  compact?: boolean;
  label?: string;
}) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const lib = useRef<typeof import("leaflet") | null>(null);
  const framed = useRef("");
  const pick = useRef(onPick);
  useEffect(() => {
    pick.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let gone = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (gone || !box.current || map.current) return;
      lib.current = L;
      const m = L.map(box.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: !compact,
        minZoom: 5,
      }).fitBounds(NIGERIA);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
      L.tileLayer(`${esri}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
        maxZoom: 16,
        attribution:
          'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(m);
      m.createPane("labels").style.zIndex = "450";
      m.getPane("labels")!.style.pointerEvents = "none";
      L.tileLayer(`${esri}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
        maxZoom: 16,
        pane: "labels",
      }).addTo(m);
      layer.current = L.layerGroup().addTo(m);
      map.current = m;
      const ro = new ResizeObserver(() => m.invalidateSize());
      ro.observe(box.current);
      m.once("unload", () => ro.disconnect());
      box.current.dispatchEvent(new Event("npf-map-ready"));
    })();
    return () => {
      gone = true;
      map.current?.remove();
      map.current = null;
      layer.current = null;
      framed.current = "";
    };
  }, [compact]);

  // Redrawn whenever the board changes. A shift is a few dozen dots, so a
  // full redraw is cheaper than diffing them.
  useEffect(() => {
    const draw = () => {
      const L = lib.current;
      const group = layer.current;
      const m = map.current;
      if (!L || !group || !m) return;
      group.clearLayers();
      const frame: [number, number][] = [];

      // The shift's closed calls: the last twelve hours, not the month.
      const shift = Date.now() - 12 * 3_600_000;
      if (layers.history)
        for (const i of incidents) {
          if (i.status !== "Closed" || new Date(i.reported).getTime() < shift) continue;
          const p = pinOf(i.where);
          if (!p.exact) continue;
          L.circleMarker([p.lat, p.lng], {
            radius: 9,
            stroke: false,
            fillColor: "#1d628f",
            fillOpacity: 0.22,
            interactive: false,
          }).addTo(group);
        }

      if (layers.units)
        for (const u of units) {
          if (!u.geo) continue;
          const lit = u.callsign === focus;
          const sos = !!u.emergency;
          L.marker([u.geo.lat, u.geo.lng], {
            keyboard: false,
            zIndexOffset: sos ? 3000 : lit ? 2000 : 0,
            icon: L.divIcon({
              className: "",
              html: `<span class="npf-map-unit${lit ? " is-lit" : ""}${sos ? " is-sos" : ""}" style="--c:${UNIT[u.status]}"></span>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            }),
          })
            .bindTooltip(
              `<b>${esc(t(u.callsign))}</b><span>${esc(t(UNIT_WORD[u.status]))} · ${esc(t(u.officer))}</span>`,
              { className: "npf-map-tip", direction: "top", offset: [0, -8] },
            )
            .on("click", () => pick.current?.(u.callsign))
            .addTo(group);
          if (compact) frame.push([u.geo.lat, u.geo.lng]);
        }

      if (layers.calls)
        for (const i of incidents) {
          if (i.status === "Closed") continue;
          const p = pinOf(i.where);
          frame.push([p.lat, p.lng]);
          const lit = i.id === focus;
          L.marker([p.lat, p.lng], {
            zIndexOffset: lit ? 2500 : i.status === "New" ? 1000 : 500,
            title: `${i.id} ${t(i.kind)}`,
            icon: L.divIcon({
              className: "",
              html: `<span class="npf-map-call${i.status === "New" ? " is-pending" : ""}${lit ? " is-lit" : ""}${p.exact ? "" : " is-rough"}" style="--c:${GRADE[i.priority]}"><b>${i.priority}</b></span>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          })
            .bindTooltip(
              `<b>${esc(i.id)} · ${esc(t(i.kind))}</b><span>${esc(t(i.area))}${p.exact ? "" : ` · ${esc(t("approximate"))}`}</span>`,
              { className: "npf-map-tip", direction: "top", offset: [0, -16] },
            )
            .on("click", () => pick.current?.(i.id))
            .addTo(group);
        }

      // Frame once per set of things to show, not on every tick of the
      // board: a map that re-centres under the officer's hand is unusable.
      const key = `${compact}:${focus ?? ""}:${frame.length}`;
      if (framed.current !== key && frame.length) {
        framed.current = key;
        const f = focus
          ? incidents.find((i) => i.id === focus)
          : null;
        if (compact && f) {
          const p = pinOf(f.where);
          m.setView([p.lat, p.lng], p.exact ? 13 : 8, { animate: false });
        } else if (!focus) {
          m.fitBounds(L.latLngBounds(frame), {
            padding: [40, 40],
            maxZoom: 12,
            animate: false,
          });
          if (m.getZoom() < 6) m.fitBounds(NIGERIA, { animate: false });
        }
      }
    };
    draw();
    const el = box.current;
    el?.addEventListener("npf-map-ready", draw);
    return () => el?.removeEventListener("npf-map-ready", draw);
  }, [incidents, units, focus, layers, compact, t]);

  // Bring a lit call or unit into view, panning only when it is off screen.
  useEffect(() => {
    const m = map.current;
    if (!m || !focus || compact) return;
    const i = incidents.find((x) => x.id === focus);
    const u = i ? null : units.find((x) => x.callsign === focus);
    const at = i ? pinOf(i.where) : u?.geo;
    if (!at) return;
    if (m.getZoom() < 10) m.setView([at.lat, at.lng], 12, { animate: true });
    else if (!m.getBounds().pad(-0.15).contains([at.lat, at.lng]))
      m.panTo([at.lat, at.lng], { animate: true, duration: 0.35 });
  }, [focus, incidents, units, compact]);

  return (
    <div
      ref={box}
      role="region"
      aria-label={label ?? t("Map of open calls and units")}
      className="npf-map size-full"
    />
  );
}
