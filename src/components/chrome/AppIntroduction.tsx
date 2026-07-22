"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, JSX } from "react";
import { Icon } from "@/components/ui/Icon";

const INTRO_SEEN_KEY = "lumennous-intro-seen-v1";
const REPLAY_EVENT = "lumennous:intro:replay";
const INTRO_DURATION_MS = 9_000;
const EXIT_DURATION_MS = 600;

type Phase = "hidden" | "loading" | "playing" | "leaving";

interface IntroWindow extends Window {
  __lumenIntroFallback?: number;
}

const LAYERS = [
  { id: "bg", src: "/intro/bg.png" },
  { id: "halo", src: "/intro/halo.png" },
  { id: "core", src: "/intro/core.png" },
  { id: "beam", src: "/intro/beam.png" },
  { id: "stone", src: "/intro/stone.png" },
  { id: "sigil", src: "/intro/sigil.png" },
  { id: "orb1", src: "/intro/orb1.png" },
  { id: "orb2", src: "/intro/orb2.png" },
  { id: "orb3", src: "/intro/orb3.png" },
  { id: "orb4", src: "/intro/orb4.png" },
  { id: "subtitle", src: "/intro/subtitle.png" },
  { id: "title", src: "/intro/title.png" },
] as const;

const MOTES = [
  { x: 205, y: 1620, size: 9, travel: 620, duration: 5.2, delay: 3.0, peak: 0.7, violet: false },
  { x: 348, y: 1700, size: 6, travel: 780, duration: 6.1, delay: 3.4, peak: 0.55, violet: true },
  { x: 470, y: 1560, size: 8, travel: 560, duration: 4.8, delay: 3.8, peak: 0.75, violet: false },
  { x: 560, y: 1680, size: 5, travel: 840, duration: 6.6, delay: 3.2, peak: 0.5, violet: true },
  { x: 662, y: 1590, size: 10, travel: 600, duration: 5.5, delay: 4.1, peak: 0.7, violet: false },
  { x: 780, y: 1710, size: 6, travel: 760, duration: 6.0, delay: 4.5, peak: 0.55, violet: true },
  { x: 875, y: 1640, size: 8, travel: 660, duration: 5.1, delay: 4.8, peak: 0.65, violet: false },
  { x: 300, y: 1750, size: 5, travel: 700, duration: 5.9, delay: 5.2, peak: 0.5, violet: true },
  { x: 520, y: 1740, size: 7, travel: 720, duration: 5.6, delay: 5.6, peak: 0.6, violet: false },
  { x: 715, y: 1660, size: 5, travel: 800, duration: 6.3, delay: 5.9, peak: 0.5, violet: true },
] as const;

function moteStyle(mote: (typeof MOTES)[number]): CSSProperties {
  return {
    "--mote-x": `${mote.x / 10.8}%`,
    "--mote-y": `${mote.y / 19.2}%`,
    "--mote-size": `${mote.size / 10.8}%`,
    "--mote-travel": `-${mote.travel / 19.2}%`,
    "--mote-duration": `${mote.duration}s`,
    "--mote-delay": `${mote.delay}s`,
    "--mote-peak": mote.peak,
  } as CSSProperties;
}

/**
 * First-launch brand introduction, faithfully ported from the local
 * HyperFrames composition. It runs entirely from bundled assets and CSS.
 */
export function AppIntroduction(): JSX.Element | null {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [readyCount, setReadyCount] = useState(0);
  const [still, setStill] = useState(false);
  const loadedAssets = useRef(new Set<string>());
  const skipRef = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);

  const markReady = useCallback((id: string): void => {
    if (loadedAssets.current.has(id)) return;
    loadedAssets.current.add(id);
    setReadyCount(loadedAssets.current.size);
  }, []);

  const start = useCallback((): void => {
    const root = document.documentElement;
    const shell = document.getElementById("app-shell");
    const prefersStill =
      root.dataset.stim === "low" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.clearTimeout((window as IntroWindow).__lumenIntroFallback);
    window.clearTimeout(exitTimer.current);
    loadedAssets.current.clear();
    setReadyCount(0);
    setStill(prefersStill);
    root.dataset.intro = "show";
    root.style.overflow = "hidden";
    if (shell) {
      shell.inert = true;
      shell.setAttribute("aria-hidden", "true");
    }
    setPhase("loading");
  }, []);

  const finish = useCallback((): void => {
    const root = document.documentElement;
    const shell = document.getElementById("app-shell");
    const content = document.getElementById("content");

    window.clearTimeout(exitTimer.current);
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* Storage can be unavailable in strict private modes. */
    }

    root.removeAttribute("data-intro");
    root.style.removeProperty("overflow");
    if (shell) {
      shell.inert = false;
      shell.removeAttribute("aria-hidden");
    }

    const url = new URL(window.location.href);
    if (url.searchParams.get("intro") === "1") {
      url.searchParams.delete("intro");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }

    setPhase("hidden");
    window.requestAnimationFrame(() => {
      if (content instanceof HTMLElement) {
        content.tabIndex = -1;
        content.focus({ preventScroll: true });
      }
    });
  }, []);

  const dismiss = useCallback((): void => {
    if (phase === "hidden" || phase === "leaving") return;
    setPhase("leaving");
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(finish, EXIT_DURATION_MS);
  }, [finish, phase]);

  useEffect(() => {
    const replay = (): void => start();
    window.addEventListener(REPLAY_EVENT, replay);
    const bootFrame = window.requestAnimationFrame(() => {
      if (document.documentElement.dataset.intro === "show") start();
    });

    return () => {
      window.removeEventListener(REPLAY_EVENT, replay);
      window.cancelAnimationFrame(bootFrame);
      window.clearTimeout(exitTimer.current);
      const shell = document.getElementById("app-shell");
      if (shell) {
        shell.inert = false;
        shell.removeAttribute("aria-hidden");
      }
      document.documentElement.style.removeProperty("overflow");
    };
  }, [start]);

  useEffect(() => {
    if (phase !== "loading") return;
    if (readyCount >= LAYERS.length) {
      const frame = window.requestAnimationFrame(() => setPhase("playing"));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [phase, readyCount]);

  useEffect(() => {
    if (phase !== "loading") return;
    const loadingFallback = window.setTimeout(() => setPhase("playing"), 4_500);
    return () => window.clearTimeout(loadingFallback);
  }, [phase]);

  useLayoutEffect(() => {
    if (phase === "playing") document.documentElement.dataset.intro = "playing";
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || still) return;
    const timer = window.setTimeout(dismiss, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [dismiss, phase, still]);

  useEffect(() => {
    if (phase === "hidden") return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss, phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const frame = window.requestAnimationFrame(() => skipRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <section
      className={`app-intro app-intro--${phase}${still ? " app-intro--still" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-intro-title"
      aria-describedby="app-intro-description"
    >
      <h1 id="app-intro-title" className="vh">LumenNous</h1>
      <p id="app-intro-description" className="vh">
        Personal Prayer and Cosmic Consciousness
      </p>

      <div className="app-intro__stage" aria-hidden="true">
        {LAYERS.map((layer) => (
          <div key={layer.id} className={`intro-layer intro-layer--${layer.id}`}>
            <Image
              src={layer.src}
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-aspect-ratio: 9/16) 100vw, 56.25vh"
              className="intro-layer__image"
              onLoad={() => markReady(layer.id)}
              onError={() => markReady(layer.id)}
              draggable={false}
            />
          </div>
        ))}

        <div className="intro-aura" />
        <div className="intro-rings">
          <span className="intro-ring intro-ring--one" />
          <span className="intro-ring intro-ring--two" />
          <span className="intro-ring intro-ring--three" />
        </div>
        <div className="intro-motes">
          {MOTES.map((mote, index) => (
            <span
              key={`${mote.x}-${mote.y}`}
              className={`intro-mote${mote.violet ? " intro-mote--violet" : ""}`}
              style={moteStyle(mote)}
              data-mote={index + 1}
            />
          ))}
        </div>
        <div className="intro-vignette" />
      </div>

      <button
        ref={skipRef}
        type="button"
        className="app-intro__skip"
        onClick={dismiss}
        aria-label={still ? "Continue to LumenNous" : "Skip introduction"}
      >
        <span>{still ? "Continue" : "Skip"}</span>
        <Icon name="skip-forward" size={18} />
      </button>
    </section>
  );
}
