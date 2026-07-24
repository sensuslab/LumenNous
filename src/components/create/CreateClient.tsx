"use client";

import { useEffect, useState, type JSX } from "react";
import { z } from "zod";
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
import { EngineResultSchema } from "@/lib/schemas";
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
  | { kind: "loading" }
  | { kind: "result"; result: EngineResult }
  | { kind: "error"; message: string };

const AiCompletionSchema = z.object({
  id: z.string().min(1),
  model: z.string().min(1),
  content: z.string().min(1),
  finishReason: z.string().nullable(),
});

const AiCompositionSchema = z.object({
  title: z.string().min(1).max(160),
  opening: z.string().max(2000).default(""),
  prayer: z.string().max(20000).default(""),
  affirmation: z.string().max(400).default(""),
  practiceSteps: z.array(z.string().min(1).max(600)).max(12).default([]),
  reflectionPrompts: z.array(z.string().min(1).max(600)).max(6).default([]),
  closing: z.string().max(2000).default(""),
  safetyNote: z.string().max(2000).default(""),
});

const OUTPUT_LABELS: Record<EngineRequest["outputType"], string> = {
  prayer: "prayer",
  affirmation: "affirmation",
  meditation: "meditation",
  "combined-practice": "five-stage coherence practice",
};

function shouldUseAi(request: EngineRequest): boolean {
  return request.categoryId === "not-sure" && request.userNeed.trim().length > 0;
}

function extractJsonObject(content: string): unknown {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? content;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON object.");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}...`;
}

function createAiRequestBody(
  request: EngineRequest,
  localResult: EngineResult,
): {
  maxTokens: number;
  temperature: number;
  messages: Array<{ role: "system" | "user"; content: string }>;
} {
  return {
    maxTokens: 1600,
    temperature: 0.55,
    messages: [
      {
        role: "system",
        content:
          "You write LumenNous contemplative practices. Return only valid JSON. Do not include markdown. Never diagnose, promise outcomes, claim healing, or invent citations. Keep language grounded, gentle, and spiritually literate.",
      },
      {
        role: "user",
        content: truncate(
          JSON.stringify({
            task: `Generate a ${OUTPUT_LABELS[request.outputType]} based on the user's own words.`,
            outputShape: {
              title: "string",
              opening: "string",
              prayer: "string",
              affirmation: "string",
              practiceSteps: ["string"],
              reflectionPrompts: ["string"],
              closing: "string",
              safetyNote: "string",
            },
            request,
            grounding: {
              category: localResult.category,
              categoryId: localResult.categoryId,
              localTitle: localResult.title,
              localOpening: localResult.opening,
              localPrayer: localResult.prayer,
              localAffirmation: localResult.affirmation,
              localPracticeSteps: localResult.practiceSteps,
              localReflectionPrompts: localResult.reflectionPrompts,
              localClosing: localResult.closing,
              safetyBoundary: localResult.safetyNote,
            },
          }),
          5800,
        ),
      },
    ],
  };
}

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

  function buildLibrary(): EngineLibrary {
    return {
      categories: props.categories,
      prayers: props.prayers,
      affirmations: props.affirmations,
      practices: props.practices,
      prompts: props.prompts,
    };
  }

  async function compose(request: EngineRequest): Promise<void> {
    const library = buildLibrary();
    try {
      setState({ kind: "loading" });
      const localResult = composeWithEngine(request, library);
      if (localResult.safetyLevel !== "none") {
        setState({ kind: "result", result: localResult });
        return;
      }
      if (!shouldUseAi(request)) {
        setState({ kind: "result", result: localResult });
        return;
      }

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createAiRequestBody(request, localResult)),
      });

      if (!response.ok) {
        throw new Error(`AI request failed with status ${response.status}.`);
      }

      const completion = AiCompletionSchema.parse(await response.json());
      const ai = AiCompositionSchema.parse(extractJsonObject(completion.content));
      const result = EngineResultSchema.parse({
        ...localResult,
        title: ai.title || localResult.title,
        opening: ai.opening || localResult.opening,
        prayer:
          request.outputType === "affirmation"
            ? ""
            : ai.prayer || localResult.prayer,
        affirmation:
          request.outputType === "meditation" || request.outputType === "combined-practice"
            ? ""
            : ai.affirmation || localResult.affirmation,
        practiceSteps:
          ai.practiceSteps.length > 0 ? ai.practiceSteps : localResult.practiceSteps,
        reflectionPrompts:
          ai.reflectionPrompts.length > 0
            ? ai.reflectionPrompts
            : localResult.reflectionPrompts,
        closing: ai.closing || localResult.closing,
        sourceIds: [],
        traditionLabels: ["original-composition"],
        safetyNote: ai.safetyNote || localResult.safetyNote,
        assembledAt: new Date().toISOString(),
        fingerprint: `ai-${completion.id}`.slice(0, 120),
      });
      setState({ kind: "result", result });
    } catch (error) {
      console.error("Create AI request failed.", error);
      setState({
        kind: "error",
        message: shouldUseAi(request)
          ? "The AI composition service was not available. Check the DeepSeek key and try again."
          : "No compatible on-board composition was available. Try a different intention or remove an avoidance.",
      });
    }
  }

  function handleSubmit(request: EngineRequest): void {
    setLastRequest(request);
    void compose(request);
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
          if (lastRequest) void compose(lastRequest);
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
        isSubmitting={state.kind === "loading"}
      />
      {state.kind === "error" ? (
        <p role="alert" className="t-body-sm mt-4 rounded-md border border-line-subtle p-4 text-warn">
          {state.message}
        </p>
      ) : null}
    </>
  );
}
