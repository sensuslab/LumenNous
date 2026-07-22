import { notFound, redirect } from "next/navigation";
import { getPlaylistBySlug } from "@/lib/content";

export default async function LegacyPlaylistRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<never> {
  const { slug } = await params;
  if (!getPlaylistBySlug(slug)) notFound();
  redirect(`/listen/${slug}`);
}
