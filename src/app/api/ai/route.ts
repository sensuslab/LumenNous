import { z } from "zod";
import {
  createDeepSeekCompletion,
  DEEPSEEK_MODEL,
  DeepSeekMessageSchema,
} from "@/lib/ai/deepseek";

export const runtime = "nodejs";

const RequestSchema = z.object({
  messages: z.array(DeepSeekMessageSchema).min(1).max(20),
  maxTokens: z.number().int().min(64).max(4096).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export async function POST(request: Request): Promise<Response> {
  if (process.env.DEEPSEEK_AI_ENABLED !== "true") {
    return Response.json(
      { error: "The optional AI service is disabled." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid AI request." }, { status: 400 });
  }

  const totalCharacters = parsed.data.messages.reduce(
    (total, message) => total + message.content.length,
    0,
  );
  if (totalCharacters > 12_000) {
    return Response.json({ error: "AI request is too large." }, { status: 413 });
  }

  try {
    const completion = await createDeepSeekCompletion(parsed.data);
    return Response.json(completion, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(`DeepSeek ${DEEPSEEK_MODEL} request failed.`, error);
    return Response.json(
      { error: "The AI service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
