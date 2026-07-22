import type { JSX, ReactNode, SVGProps } from "react";

/**
 * Nocturne thin-line icon set (design.md §2.11 / §10).
 * 24×24 viewBox · 1.5px stroke · round caps/joins · fill none · currentColor.
 * Abstract celestial-geometric vocabulary only — no clip-art mysticism.
 *
 * Decorative by default (aria-hidden). Pass `label` to expose the icon
 * to assistive tech with an accessible name.
 */

const PATHS = {
  /* Logo mark: three concentric circles, outer broken at 45° with gold dot */
  aperture: (
    <>
      <path d="M17.74 3.81 A 10 10 0 1 0 20.19 5.26" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="19.07" cy="4.93" r="1.1" fill="var(--gold)" stroke="none" />
    </>
  ),
  /* Navigation set */
  sunrise: (
    <>
      <path d="M7 17a5 5 0 0 1 10 0" />
      <path d="M12 4v3" />
      <path d="M5.6 7.6 7.2 9.2" />
      <path d="M18.4 7.6 16.8 9.2" />
      <path d="M3 17h18" />
      <path d="M7 20.5h10" />
    </>
  ),
  constellation: (
    <>
      <path d="M6.2 16.8 8.6 8.4" />
      <path d="M8.6 8.4 16.8 5.2" />
      <path d="M8.6 8.4 18.4 14.6" />
      <path d="M16.8 5.2 18.4 14.6" />
      <circle cx="5.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="8.6" cy="8.4" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.6" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  spark: (
    <path d="M12 3 Q13.1 10.9 21 12 Q13.1 13.1 12 21 Q10.9 13.1 3 12 Q10.9 10.9 12 3 Z" />
  ),
  waveform: (
    <>
      <path d="M4 9.5v5" />
      <path d="M8 6v12" />
      <path d="M12 4v16" />
      <path d="M16 7v10" />
      <path d="M20 10v4" />
    </>
  ),
  "book-open": (
    <>
      <path d="M12 6.5C10 5 7.2 4.5 4 4.5V18c3.2 0 6 .5 8 2 2-1.5 4.8-2 8-2V4.5c-3.2 0-6 .5-8 2Z" />
      <path d="M12 6.5V20" />
    </>
  ),
  /* Utility set */
  heart: (
    <path d="M12 20.5C7 16.5 4 13 4 9.6 4 7 6 5 8.5 5c1.7 0 3 .9 3.5 2 .5-1.1 1.8-2 3.5-2C18 5 20 7 20 9.6c0 3.4-3 6.9-8 10.9Z" />
  ),
  "heart-fill": (
    <path
      d="M12 20.5C7 16.5 4 13 4 9.6 4 7 6 5 8.5 5c1.7 0 3 .9 3.5 2 .5-1.1 1.8-2 3.5-2C18 5 20 7 20 9.6c0 3.4-3 6.9-8 10.9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="18.5" r="2.2" />
      <path d="M7.9 10.9 16.1 6.6" />
      <path d="M7.9 13.1 16.1 17.4" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  play: <path d="M8 5.2 18.6 12 8 18.8Z" />,
  pause: (
    <>
      <path d="M9.5 5v14" />
      <path d="M14.5 5v14" />
    </>
  ),
  "skip-back": (
    <>
      <path d="M6.5 5v14" />
      <path d="M18 5.5 9.5 12 18 18.5Z" />
    </>
  ),
  "skip-forward": (
    <>
      <path d="M17.5 5v14" />
      <path d="M6 5.5 14.5 12 6 18.5Z" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  "chevron-down": <path d="M6 9.5 12 15.5 18 9.5" />,
  "chevron-left": <path d="M14.5 6 8.5 12l6 6" />,
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 10v3.5h3" />
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5V5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10.5 12 15.5 17 10.5" />
      <path d="M4 20.5h16" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7.3 20a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9L17.5 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.2" />
      <path d="M12 11v5.5" />
    </>
  ),
  "note-music": (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  /* Celestial & category vocabulary */
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M4.9 4.9l1.5 1.5" />
      <path d="M17.6 17.6l1.5 1.5" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="M4.9 19.1l1.5-1.5" />
      <path d="M17.6 6.4l1.5-1.5" />
    </>
  ),
  "sun-arc": (
    <>
      <path d="M6 18a6 6 0 0 1 12 0" />
      <path d="M12 6v2.5" />
      <path d="M4.6 9.6 6 11" />
      <path d="M19.4 9.6 18 11" />
      <path d="M2 18h20" />
      <path d="M5 21.5h14" />
    </>
  ),
  moon: <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7 7 0 0 0 9.7 9.7Z" />,
  star: (
    <path d="M12 4l1.9 6.1L20 12l-6.1 1.9L12 20l-1.9-6.1L4 12l6.1-1.9Z" />
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-24 12 12)" />
      <circle cx="4.9" cy="15.3" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  "orbit-dot": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  flame: (
    <path d="M12 2.8c2 3.4 5.5 5.9 5.5 10.4a5.5 5.5 0 0 1-11 0c0-2.8 1.5-4.9 3.1-6.6.1 2 .8 3 2 3.7-.7-2.7-.4-5.3.4-7.5Z" />
  ),
  drop: (
    <path d="M12 3c3 4.6 6 7.9 6 11.2a6 6 0 0 1-12 0C6 10.9 9 7.6 12 3Z" />
  ),
  leaf: (
    <>
      <path d="M6 18C6 10 10.5 5 19 4.5 19 13 14.5 18 6 18Z" />
      <path d="M6 18C9 13 13 9 17 6" />
    </>
  ),
  "leaf-still": (
    <>
      <path d="M6 15.5C6 8.5 10.5 4.5 18 4c0 7.5-4.5 11.5-12 11.5Z" />
      <path d="M6 15.5C9 11 12.5 7.5 16 5" />
      <path d="M4 20h16" />
    </>
  ),
  root: (
    <>
      <path d="M12 3v11" />
      <path d="M12 14c-2 2-4 3-5.5 6.5" />
      <path d="M12 14c2 2 4 3 5.5 6.5" />
      <path d="M12 14v7" />
      <path d="M12 7.5C10.5 7.5 9.5 8.5 8.5 10" />
    </>
  ),
  shield: <path d="M12 3 19 5.8v5.4c0 4.8-3 8.3-7 9.8-4-1.5-7-5-7-9.8V5.8Z" />,
  "shield-quiet": (
    <>
      <path d="M12 3 19 5.8v5.4c0 4.8-3 8.3-7 9.8-4-1.5-7-5-7-9.8V5.8Z" />
      <circle cx="12" cy="11" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  hand: (
    <>
      <path d="M6.5 20.5C5 18.6 4.5 16 4.5 13V9.8" />
      <path d="M17.5 20.5c1.5-1.9 2-4.5 2-7.5V9.5" />
      <path d="M7.5 10.5V5.8" />
      <path d="M10.75 10V4.2" />
      <path d="M14 10V4.8" />
      <path d="M17.5 11V7" />
      <path d="M4.5 9.8c0-1 .8-1.6 1.5-1.2.8.4 1.5 1.4 1.5 1.9" />
      <path d="M17.5 9.5c0-1.2 1-1.7 1.8-1 .6.5.4 1.5-.3 2.6l-1.5 2.4" />
    </>
  ),
  breath: (
    <>
      <path d="M3 8c3-2 5 2 8 0s5-2 7 0" />
      <path d="M3 12.5c3-2 5 2 8 0s4-1.5 6 0" />
      <path d="M6 17c2.5-1.5 4 1.5 6.5 0s3.5-1 5 0" />
    </>
  ),
  ear: (
    <>
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 2.8-1.5 3.8-2.9 5.2-1.2 1.2-2.1 2-2.1 3.3a3 3 0 0 1-6 0" />
      <path d="M9.8 10a2.4 2.4 0 0 1 4.8 0c0 1.5-1 2.1-1.8 2.9" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-14A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" />
    </>
  ),
  "compass-line": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.8 8.2 8.2 15.8" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  infinity: (
    <path d="M8 15c-2.8 0-5-1.4-5-3s2.2-3 5-3c4.2 0 3.8 6 8 6 2.8 0 5-1.4 5-3s-2.2-3-5-3c-4.2 0-3.8 6-8 6Z" />
  ),
  mountain: <path d="M3 18.5 9 7l4.2 6.3L15.8 10 21 18.5Z" />,
  wave: <path d="M2 12c2.5-4.5 5-4.5 7.5 0s5 4.5 7.5 0 4-3.6 5-2" />,
  "wave-sine": (
    <path d="M2 12c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0" />
  ),
  feather: (
    <>
      <path d="M20 4C12.5 4.5 7 9 5.5 16.5L5 19l2.5-.5C15 17 19.5 11.5 20 4Z" />
      <path d="M20 4 8 17" />
      <path d="M8 13h3.5" />
      <path d="M11.5 9H15" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </>
  ),
  circle: <circle cx="12" cy="12" r="8.5" />,
  spiral: (
    <path d="M12 12c1 0 1.5.8 1 1.5-.7 1-2.5.8-3-.5-.7-1.8.8-4.2 3.2-4 3 .3 4.8 3.5 3.6 6.6-1.4 3.6-6.2 4.8-9.2 2.2C4.2 14.9 4.6 9.2 8.4 6.4" />
  ),
  crown: (
    <>
      <path d="M4 17 3 8l5.5 4L12 5l3.5 7L21 8l-1 9Z" />
      <path d="M4 20h16" />
    </>
  ),
  seed: (
    <>
      <path d="M12 21c-3.3 0-5.5-2.4-5.5-5.5C6.5 12 9 9.5 12 9.5s5.5 2.5 5.5 6c0 3.1-2.2 5.5-5.5 5.5Z" />
      <path d="M12 9.5C12 6.2 13.8 4.3 17 4c-.2 3-2 5-5 5.5Z" />
    </>
  ),
  key: (
    <>
      <circle cx="7" cy="7" r="3.5" />
      <path d="M9.5 9.5 20 20" />
      <path d="m16.5 16.5 2.8-2.8" />
      <path d="m13.8 13.8 2.8-2.8" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12C5.5 6.8 9 5 12 5s6.5 1.8 9.5 7c-3 5.2-6.5 7-9.5 7s-6.5-1.8-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  dove: (
    <>
      <path d="M3 15.5C6 10.5 10 8.3 14 9c1.8.3 3.3-1 4.8-3.5.6 3.2-.5 6.8-3 9.2C12.6 17.9 7 18.4 3 15.5Z" />
      <path d="M7.5 13.8c2.4-1.4 4.8-1.6 7-1" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="3" />
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Pixel size of the square icon box. Default 24. */
  size?: number;
  /** Accessible name. When omitted the icon is aria-hidden (decorative). */
  label?: string;
}

export function Icon({
  name,
  size = 24,
  label,
  strokeWidth = 1.5,
  ...rest
}: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...rest}
    >
      {PATHS[name] as ReactNode}
    </svg>
  );
}
