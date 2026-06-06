// Per-subject line icons — give each shoot type its own visual motif.
// 24x24, stroke = currentColor so they pick up the theme accent.
export type IconName =
  | "wave"
  | "leaf"
  | "sun"
  | "camera"
  | "balloon"
  | "rings"
  | "film"
  | "flame"
  | "mountain"
  | "building"
  | "drone"
  | "aperture";

export default function SubjectIcon({
  name,
  className = "",
  strokeWidth = 1.4,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "wave":
      return (
        <svg {...common}>
          <path d="M2 9c2 0 2 1.6 4 1.6S8 9 10 9s2 1.6 4 1.6S16 9 18 9s2 1.6 4 1.6" />
          <path d="M2 15c2 0 2 1.6 4 1.6S8 15 10 15s2 1.6 4 1.6S16 15 18 15s2 1.6 4 1.6" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16a7 7 0 0 1-7-7Z" />
          <path d="M5 19c4-6 8-9 14-11" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M3 8h3l1.5-2h9L18 8h3v11H3z" />
          <circle cx="12" cy="13" r="3.4" />
        </svg>
      );
    case "balloon":
      return (
        <svg {...common}>
          <path d="M12 3a5 5 0 0 1 5 5c0 3.5-2.5 6-5 6.5C9.5 14 7 11.5 7 8a5 5 0 0 1 5-5Z" />
          <path d="M12 14.5V17M12 17c1 1 2 1 2 3M12 17c-1 1-2 1-2 3" />
        </svg>
      );
    case "rings":
      return (
        <svg {...common}>
          <circle cx="9" cy="14" r="5" />
          <circle cx="15" cy="14" r="5" />
          <path d="M9 4l1.5 3M15 4l-1.5 3M9 4h6" />
        </svg>
      );
    case "film":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="1" />
          <path d="M7 4v16M17 4v16M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M12 3c0 3-4 4-4 8a4 4 0 0 0 8 0c0-2-1-3-1-4 1 .5 2 1.5 2 3a6 6 0 0 1-12 0c0-4 5-5 7-7Z" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="M3 19 9 7l4 7 2.5-4L21 19z" />
          <path d="M9 7l2 3.5" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M4 21V6l8-3 8 3v15" />
          <path d="M9 21v-4h6v4M8 8h2M14 8h2M8 12h2M14 12h2" />
        </svg>
      );
    case "drone":
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2.5" />
          <circle cx="19" cy="6" r="2.5" />
          <circle cx="5" cy="18" r="2.5" />
          <circle cx="19" cy="18" r="2.5" />
          <path d="M7 7.5 10 10m4 0 3-2.5M7 16.5 10 14m4 0 3 2.5" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
        </svg>
      );
    case "aperture":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3l4.5 7.8M21 12l-9 0M16.5 19.8 12 12M7.5 19.8 12 12M3 12h9M7.5 4.2 12 12" />
        </svg>
      );
  }
}
