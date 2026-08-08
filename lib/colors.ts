/**
 * Client-side helpers for generating deterministic avatar colors and initials.
 * Kept in sync with the palette used by the socket server so that the same
 * user always renders with the same color on every client.
 */

const PALETTE = [
  "#4285F4",
  "#EA4335",
  "#FBBC04",
  "#34A853",
  "#F06292",
  "#8E24AA",
  "#00ACC1",
  "#6D4C41",
  "#5C6BC0",
  "#D81B60",
  "#039BE5",
  "#7CB342",
];

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
