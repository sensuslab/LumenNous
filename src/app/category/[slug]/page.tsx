import { notFound, redirect } from "next/navigation";
import { resolveCategory } from "@/lib/content";

export default async function LegacyCategoryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<never> {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();
  redirect(`/explore/${category.slug}`);
}
