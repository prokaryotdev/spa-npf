"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { Incident, Unit } from "./store";
import { NIGERIA_CENTRE, placeOf } from "./ops-geo";
import { useT } from "../i18n/client";

const GRADE: Record<Incident["priority"], string> = {
  P1: "var(--ops-p1)",
  P2: "var(--ops-p2)",
  P3: "var(--ops-p3)",
  P4: "#8e93a0",
};

const UNIT: Record<Unit["status"], string> = {
  Available: "var(--ops-ok)",
  Assigned: "var(--ops-route)",
  "On Scene": "var(--ops-scene)",
  Unavailable: "#6b7080",
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * The live picture: every open call and every unit on a dark map of
 * Nigeria. Calls are grade-coloured beacons, a pending one ringed with a
 * slow pulse; units are small dots in their status colour. Hovering a row
 * on the board lights its beacon here, and a beacon names itself on hover.
 *
 * Leaflet is loaded in the browser only, after mount: it reads `window` on
 * import, and the console never renders a timer or a map on the server.
 */
export default function OpsMap({
  incidents,
  units,
  focus,
  onPick,
  sheets = false,
}: {
  incidents: Incident[];
  units: Unit[];
  /** A call id or a unit callsign to light up and bring into view. */
  focus: string | null;
  onPick?: (id: string) => void;
  /** The board floats sheets over the map's edges; frame inside them. */
  sheets?: boolean;
}) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const lib = useRef<typeof import("leaflet") | null>(null);
  const fitted = useRef(false);
  const pick = useRef(onPick);
  useEffect(() => {
    pick.current = onPick;
  }, [onPick]);

  // The map itself, once.
  useEffect(() => {
    let gone = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (gone || !box.current || map.current) return;
      lib.current = L;
      const m = L.map(box.current, {
        center: NIGERIA_CENTRE,
        zoom: 6,
        minZoom: 5,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
      });
      L.control.zoom({ position: "bottomright" }).addTo(m);
      // ponytail: Esri's public Dark Gray Canvas tiles, keyless. Fine for a
      // demo; production needs an ArcGIS account (or a self-hosted tile
      // source) under its terms. CARTO's dark tiles now need an API key.
      const esri =
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
      L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
        maxZoom: 16,
        className: "npf-map-base",
        attribution:
          'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(m);
      // Place names on their own pane above the base, so the base can be
      // dimmed to the console's black without dimming the labels with it.
      m.createPane("labels").style.zIndex = "450";
      m.getPane("labels")!.style.pointerEvents = "none";
      L.tileLayer(
        `${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
        { maxZoom: 16, pane: "labels" },
      ).addTo(m);
      layer.current = L.layerGroup().addTo(m);
      map.current = m;
      // The box can change size with the layout; keep the tiles filling it.
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
      fitted.current = false;
    };
  }, []);

  // The markers, redrawn whenever the board changes. A shift is a few dozen
  // dots, so a full redraw is cheaper than diffing them.
  useEffect(() => {
    const draw = () => {
      const L = lib.current;
      const group = layer.current;
      const m = map.current;
      if (!L || !group || !m) return;
      group.clearLayers();
      // Units stay on the map but do not set its frame: the opening view is
      // the open calls.
      const points: [number, number][] = [];
      const calls: [number, number][] = [];
      const waiting: [number, number][] = [];

      for (const u of units) {
        const at = placeOf(u.area, u.callsign);
        if (!at) continue;
        points.push(at);
        const lit = u.callsign === focus;
        const dot = L.marker(at, {
          keyboard: false,
          zIndexOffset: lit ? 2000 : 0,
          icon: L.divIcon({
            className: "",
            html: `<span class="npf-map-unit${lit ? " is-lit" : ""}" style="--c:${UNIT[u.status]}"></span>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
        })
          .bindTooltip(
            `<b>${esc(t(u.callsign))}</b><span>${esc(t(u.status))} · ${esc(t(u.area))}</span>`,
            { className: "npf-map-tip", direction: "top", offset: [0, -8] },
          )
          .addTo(group);
        if (lit) dot.openTooltip();
      }

      for (const i of incidents) {
        if (i.status === "Closed") continue;
        const at = placeOf(i.area, i.id);
        if (!at) continue;
        points.push(at);
        calls.push(at);
        if (i.status === "New") waiting.push(at);
        const lit = i.id === focus;
        const marker = L.marker(at, {
          zIndexOffset: lit ? 2000 : i.status === "New" ? 1000 : 500,
          title: `${i.id} ${t(i.kind)}`,
          icon: L.divIcon({
            className: "",
            html: `<span class="npf-map-call${i.status === "New" ? " is-pending" : ""}${lit ? " is-lit" : ""}" style="--c:${GRADE[i.priority]}"><b>${i.priority}</b></span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        })
          .bindTooltip(
            `<b>${esc(i.id)} · ${esc(t(i.kind))}</b><span>${esc(t(i.area))}</span>`,
            { className: "npf-map-tip", direction: "top", offset: [0, -16] },
          )
          .addTo(group);
        marker.on("click", () => pick.current?.(i.id));
        if (lit) marker.openTooltip();
      }

      if (!fitted.current && points.length) {
        fitted.current = true;
        // On the board, frame the dots in the open water between the sheets
        // floating over the map: calls from 1024px, units from 1280.
        const wide = (px: number) =>
          sheets && window.matchMedia(`(min-width: ${px}px)`).matches;
        const padL = wide(1024) ? 420 : 32;
        const padR = wide(1280) ? 340 : 32;
        const frame = L.latLngBounds(
          calls.length > 1 ? calls : points,
        );
        m.fitBounds(frame, {
          paddingTopLeft: [padL, 48],
          paddingBottomRight: [padR, 48],
          maxZoom: 9,
          animate: false,
        });
        // Never open wider than the country: on a small screen fitBounds can
        // back out to half of West Africa. Hold the national view, centred on
        // the calls still waiting for a unit.
        if (m.getZoom() < 6) {
          const heart = waiting.length ? L.latLngBounds(waiting) : frame;
          m.setView(heart.getCenter(), 6, { animate: false });
          m.panBy([(padR - padL) / 2, 0], { animate: false });
        }
      }
    };
    draw();
    const el = box.current;
    el?.addEventListener("npf-map-ready", draw);
    return () => el?.removeEventListener("npf-map-ready", draw);
  }, [incidents, units, focus, sheets, t]);

  // Bring a lit call or unit into view without yanking the map around:
  // only pan when it is actually off screen.
  useEffect(() => {
    const m = map.current;
    if (!m || !focus) return;
    const i = incidents.find((x) => x.id === focus);
    const u = i ? null : units.find((x) => x.callsign === focus);
    const at = i
      ? placeOf(i.area, i.id)
      : u
        ? placeOf(u.area, u.callsign)
        : null;
    if (at && !m.getBounds().pad(-0.15).contains(at))
      m.panTo(at, { animate: true, duration: 0.35 });
  }, [focus, incidents, units]);

  return (
    <div
      ref={box}
      role="region"
      aria-label={t("Map of open calls and units")}
      className="npf-map size-full"
    />
  );
}
