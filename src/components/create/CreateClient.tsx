"use client";

import { useEffect, useState, type JSX } from "react";
import type {
  Affirmation,
  Category,
  EngineRequest,
  EngineResult,
  Practice,
  Prayer,
  ReflectionPrompt,
  Source,
} from "@/lib/schemas";
import { composeWithEngine, type EngineLibrary } from "@/lib/engine";
import { getCoherenceSessionForCategory } from "@/data/session-templates";
import { avoidsBreathFocus } from "@/lib/coherence";
import { CreateRequestForm } from "./CreateRequestForm";
import { EngineResultCard } from "./EngineResultCard";
import { EngineSafetyNotice } from "./EngineSafetyNotice";

interface CreateLibraryProps {
  categories: readonly Category[];
  prayers: readonly Prayer[];
  affirmations: readonly Affirmation[];
  practices: readonly Practice[];
  prompts: readonly ReflectionPrompt[];
  sourcesById: Record<string, Source>;
}

type State =
  | { kind: "form" }
  | { kind: "result"; result: EngineResult }
  | { kind: "error"; message: string };

export function CreateClient(props: CreateLibraryProps): JSX.Element {
  const [state, setState] = useState<State>({ kind: "form" });
  const [lastRequest, setLastRequest] = useState<EngineRequest | null>(null);
  const resultFingerprint = state.kind === "result" ? state.result.fingerprint : null;

  useEffect(() => {
    if (!resultFingerprint) return;
    const frame = window.requestAnimationFrame(() => {
      const result = document.getElementById("engine-result");
      result?.focus({ preventScroll: true });
      result?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [resultFingerprint]);

  function compose(request: EngineRequest): void {
    const library: EngineLibrary = {
      categories: props.categories,
      prayers: props.prayers,
      affirmations: props.affirmations,
      practices: props.practices,
      prompts: props.prompts,
    };
    try {
      const result = composeWithEngine(request, library);
      setState({ kind: "result", result });
    } catch {
      setState({
        kind: "error",
        message: "No compatible composition was available. Try a different intention or remove an avoidance.",
      });
    }
  }

  function handleSubmit(request: EngineRequest): void {
    setLastRequest(request);
    compose(request);
  }

  if (state.kind === "result") {
    if (state.result.safetyLevel !== "none") {
      return (
        <EngineSafetyNotice
          result={state.result}
          onReset={() => {
            setLastRequest(null);
            setState({ kind: "form" });
          }}
        />
      );
    }
    const category = props.categories.find((item) => item.id === state.result.categoryId);
    const sources = state.result.sourceIds
      .map((id) => props.sourcesById[id])
      .filter((source): source is Source => source !== undefined);
    const coherenceSession = getCoherenceSessionForCategory(
      state.result.categoryId,
    );
    const coherenceUsesGrounding =
      lastRequest !== null && avoidsBreathFocus(lastRequest.avoidances);
    return (
      <EngineResultCard
        result={state.result}
        sources={sources}
        categorySlug={category?.slug ?? "grounding-and-stillness"}
        coherenceSessionHref={
          state.result.outputType === "combined-practice" && coherenceSession
            ? `/sessions/${coherenceSession.slug}${
                coherenceUsesGrounding ? "?regulation=grounding" : ""
              }`
            : null
        }
        onCreateAnother={() => {
          if (lastRequest) compose(lastRequest);
        }}
        onEditRequest={() => setState({ kind: "form" })}
      />
    );
  }

  return (
    <>
      <CreateRequestForm
        categories={props.categories}
        onSubmit={handleSubmit}
        initialRequest={lastRequest ?? undefined}
      />
      {state.kind === "error" ? (
        <p role="alert" className="t-body-sm mt-4 rounded-md border border-line-subtle p-4 text-warn">
          {state.message}
        </p>
      ) : null}
    </>
  );
}
