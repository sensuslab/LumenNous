import "server-only";

import { z } from "zod";

export const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
export const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-pro";

export const DeepSeekMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(6000),
});

export type DeepSeekMessage = z.infer<typeof DeepSeekMessageSchema>;

const DeepSeekResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  choices: z
    .array(
      z.object({
        finish_reason: z.string().nullable(),
        message: z.object({
          role: z.literal("assistant"),
          content: z.string(),
        }),
      }),
    )
    .min(1),
});

export interface DeepSeekCompletionOptions {
  messages: DeepSeekMessage[];
  maxTokens?: number;
  temperature?: number;
}

export async function createDeepSeekCompletion({
  messages,
  maxTokens = 1200,
  temperature = 0.4,
}: DeepSeekCompletionOptions): Promise<{
  id: string;
  model: string;
  content: string;
  finishReason: string | null;
}> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured.");

  const response = await fetch(`${DEEPSEEK_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
      thinking: { type: "enabled" },
      reasoning_effort: "high",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed with status ${response.status}.`);
  }

  const payload = DeepSeekResponseSchema.parse(await response.json());
  const choice = payload.choices[0];
  return {
    id: payload.id,
    model: payload.model,
    content: choice.message.content,
    finishReason: choice.finish_reason,
  };
}
