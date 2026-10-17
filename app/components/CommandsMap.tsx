"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { STATES } from "../geo";
import { useT } from "../i18n/client";

const NIGERIA: [[number, number], [number, number]] = [
  [4.2, 2.7],
  [13.9, 14.7],
];

/**
 * The 37 Commands on the console's light map, one pin each at the capital.
 * A pin picks its Command; the picked one is lit and the map flies to it.
 * Force HQ has no pin: it sits on the FCT Command's and would hide it.
 *
 * ponytail: same keyless Esri tiles as OpsMap; licence before production.
 */
export default function CommandsMap({
  picked,
  zone,
  onPick,
}: {
  picked: string | null;
  /** A zone to frame, with the other zones' pins dimmed. */
  zone: string | null;
  onPick: (state: string) => void;
}) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const lib = useRef<typeof import("leaflet") | null>(null);
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
        scrollWheelZoom: false,
        minZoom: 4,
        zoomSnap: 0.25,
      }).fitBounds(NIGERIA);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
      L.tileLayer(`${esri}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
        maxZoom: 16,
        attribution:
          'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
    };
  }, []);

  useEffect(() => {
    const draw = () => {
      const L = lib.current;
      const group = layer.current;
      const m = map.current;
      if (!L || !group || !m) return;
      group.clearLayers();
      const pin = (
        at: [number, number],
        name: string,
        lit: boolean,
        dim: boolean,
        state: string,
      ) =>
        L.marker(at, {
          title: name,
          alt: name,
          zIndexOffset: lit ? 2000 : 0,
          icon: L.divIcon({
            className: "",
            html: `<span class="npf-map-cmd${lit ? " is-lit" : ""}${dim ? " is-dim" : ""}"></span>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        })
          .bindTooltip(name, {
            className: "npf-map-tip",
            direction: "top",
            offset: [0, -10],
          })
          .on("click", () => pick.current(state))
          .addTo(group);

      for (const s of STATES)
        pin(
          [s.lat, s.lng],
          s.name === "FCT"
            ? t("FCT Command")
            : t("{state} State Command", { state: s.name }),
          picked === s.name,
          !!zone && s.zone !== zone,
          s.name,
        );

      const s = STATES.find((x) => x.name === picked);
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (s) m.flyTo([s.lat, s.lng], 7, { animate: !still, duration: 0.8 });
      else if (zone)
        m.flyToBounds(
          L.latLngBounds(
            STATES.filter((x) => x.zone === zone).map((x) => [x.lat, x.lng]),
          ),
          { animate: !still, duration: 0.8, padding: [48, 48] },
        );
      else m.flyToBounds(NIGERIA, { animate: !still, duration: 0.8 });
    };
    draw();
    const el = box.current;
    el?.addEventListener("npf-map-ready", draw);
    return () => el?.removeEventListener("npf-map-ready", draw);
  }, [picked, zone, t]);

  return (
    <div
      ref={box}
      role="region"
      aria-label={t("Map of the State Commands")}
      className="npf-map size-full"
    />
  );
}
