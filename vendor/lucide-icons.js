/**
 * @license lucide v1.8.0 - ISC
 *
 * Exact descriptors for the locally used Lucide controls.
 * See LICENSE-lucide.txt.
 */

const ICONS = Object.freeze({
  Settings: [
    ["path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ],
  Copy: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
  ],
  CircleCheck: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }]
  ],
  X: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ],
  ChevronLeft: [
    ["path", { d: "m15 18-6-6 6-6" }]
  ],
  Plus: [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }]
  ],
  Search: [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }]
  ],
  ChevronDown: [
    ["path", { d: "m6 9 6 6 6-6" }]
  ],
  Star: [
    ["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.751a.53.53 0 0 1 .294.904l-3.738 3.644a2.12 2.12 0 0 0-.61 1.878l.882 5.146a.53.53 0 0 1-.769.559l-4.62-2.428a2.12 2.12 0 0 0-1.97 0l-4.62 2.428a.53.53 0 0 1-.769-.56l.882-5.145a2.12 2.12 0 0 0-.61-1.878L2.16 9.79a.53.53 0 0 1 .294-.904l5.165-.752a2.12 2.12 0 0 0 1.597-1.16z" }]
  ]
});

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function createLucideIcon(name, className = "lucide-icon") {
  const descriptor = ICONS[name];
  if (!descriptor) throw new TypeError(`Unsupported Lucide icon: ${name}`);

  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  for (const [tagName, attributes] of descriptor) {
    const node = document.createElementNS(SVG_NAMESPACE, tagName);
    for (const [attribute, value] of Object.entries(attributes)) {
      node.setAttribute(attribute, value);
    }
    svg.append(node);
  }

  return svg;
}

export const LUCIDE_ICON_NAMES = Object.freeze(Object.keys(ICONS));
