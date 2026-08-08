/**
 * Inline SVG icons for the handful of glyphs that are not shipped by
 * lucide-react v1.28 (text alignment + history). Keeping them here avoids
 * pulling in a second icon library.
 */

type IconProps = {
  className?: string;
  size?: number;
};

function base(className?: string) {
  return `h-4 w-4 ${className ?? ""}`.trim();
}

export function AlignLeftIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
    >
      <line x1="4" x2="20" y1="5" y2="5" />
      <line x1="4" x2="14" y1="10" y2="10" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="4" x2="12" y1="20" y2="20" />
    </svg>
  );
}

export function AlignCenterIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
    >
      <line x1="4" x2="20" y1="5" y2="5" />
      <line x1="7" x2="17" y1="10" y2="10" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="9" x2="15" y1="20" y2="20" />
    </svg>
  );
}

export function AlignRightIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
    >
      <line x1="4" x2="20" y1="5" y2="5" />
      <line x1="10" x2="20" y1="10" y2="10" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="12" x2="20" y1="20" y2="20" />
    </svg>
  );
}

export function AlignJustifyIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
    >
      <line x1="4" x2="20" y1="5" y2="5" />
      <line x1="4" x2="20" y1="10" y2="10" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="4" x2="20" y1="20" y2="20" />
    </svg>
  );
}

export function HistoryIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
