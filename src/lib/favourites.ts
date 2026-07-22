"use client";

/**
 * Saved items - local, consent-gated browser storage.
 *
 * - No account. Saved items live in this browser's localStorage only.
 * - First save requires an explicit, calm consent moment (UI-owned).
 * - Export as JSON and delete-all are first-class.
 * - No analytics are attached to saved items.
 * - Local storage is NOT cloud backup: clearing browser data removes it,
 *   and nothing leaves the device. Say this plainly wherever we mention it.
 */

import { useCallback, useSyncExternalStore } from "react";

export type FavouriteType =
  | "prayer"
  | "affirmation"
  | "practice"
  | "playlist"
  | "teaching";

export interface FavouriteEntry {
  id: string;
  type: FavouriteType;
  title: string;
  href: string;
  addedAt: string;
}

const STORAGE_KEY = "lumennous-saved";
const CONSENT_KEY = "lumennous-saved-consent";
const LEGACY_STORAGE_KEY = "pe-favourites";
const LEGACY_CONSENT_KEY = "pe-favourites-consent";

/* ------------------------------------------------------------------ */
/* Store (framework-free core so it stays testable and SSR-safe)        */
/* ------------------------------------------------------------------ */

interface FavouritesState {
  favourites: FavouriteEntry[];
  consentGiven: boolean;
  hydrated: boolean;
}

const SERVER_STATE: FavouritesState = {
  favourites: [],
  consentGiven: false,
  hydrated: false,
};

let state: FavouritesState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function readStorage(): FavouritesState {
  if (typeof window === "undefined") return state;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const consent =
      (window.localStorage.getItem(CONSENT_KEY) ??
        window.localStorage.getItem(LEGACY_CONSENT_KEY)) === "yes";
    if (!raw) return { favourites: [], consentGiven: consent, hydrated: true };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { favourites: [], consentGiven: consent, hydrated: true };
    }
    const favourites = parsed.filter(
      (entry): entry is FavouriteEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as FavouriteEntry).id === "string" &&
        typeof (entry as FavouriteEntry).title === "string" &&
        typeof (entry as FavouriteEntry).href === "string" &&
        typeof (entry as FavouriteEntry).addedAt === "string" &&
        ["prayer", "affirmation", "practice", "playlist", "teaching"].includes(
          (entry as FavouriteEntry).type,
        ),
    );
    return { favourites, consentGiven: consent, hydrated: true };
  } catch {
    return { favourites: [], consentGiven: false, hydrated: true };
  }
}

function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readStorage();
  emit();
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favourites));
  } catch {
    /* storage full or unavailable — favourites simply won't persist */
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  hydrate();
  return () => listeners.delete(listener);
}

function getSnapshot(): FavouritesState {
  return state;
}

function getServerSnapshot(): FavouritesState {
  return SERVER_STATE;
}

/* ------------------------------------------------------------------ */
/* Mutations                                                            */
/* ------------------------------------------------------------------ */

export function grantFavouritesConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, "yes");
  } catch {
    /* ignore */
  }
  state = { ...state, consentGiven: true };
  emit();
}

export function toggleFavourite(entry: FavouriteEntry): void {
  const exists = state.favourites.some((f) => f.id === entry.id);
  state = {
    ...state,
    favourites: exists
      ? state.favourites.filter((f) => f.id !== entry.id)
      : [...state.favourites, entry],
  };
  persist();
  emit();
}

export function clearAllFavourites(): void {
  state = { ...state, favourites: [] };
  persist();
  emit();
}

export function exportFavouritesJson(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      note: "LumenNous saved items - local browser data, not a cloud backup.",
      savedItems: state.favourites,
    },
    null,
    2,
  );
}

/* ------------------------------------------------------------------ */
/* React hook                                                           */
/* ------------------------------------------------------------------ */

export interface UseFavourites {
  favourites: FavouriteEntry[];
  isFavourite: (id: string) => boolean;
  toggle: (entry: FavouriteEntry) => void;
  clearAll: () => void;
  consentGiven: boolean;
  grantConsent: () => void;
  exportJson: () => string;
  /** False until client hydration completes — render neutrally before then. */
  ready: boolean;
}

export function useFavourites(): UseFavourites {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavourite = useCallback(
    (id: string) => snapshot.favourites.some((f) => f.id === id),
    [snapshot.favourites],
  );

  return {
    favourites: snapshot.favourites,
    isFavourite,
    toggle: toggleFavourite,
    clearAll: clearAllFavourites,
    consentGiven: snapshot.consentGiven,
    grantConsent: grantFavouritesConsent,
    exportJson: exportFavouritesJson,
    ready: snapshot.hydrated,
  };
}
