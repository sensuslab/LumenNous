import type { JSX } from "react";

/** Calm skeleton while a category room resolves (category.md). */
export default function CategoryLoading(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[720px] animate-pulse" aria-hidden="true">
      <div className="h-11 w-24 rounded-sm bg-[rgba(230,225,211,0.04)]" />
      <div className="mt-6 h-16 w-16 rounded-sm bg-[rgba(230,225,211,0.05)]" />
      <div className="mt-4 h-9 w-2/3 rounded-sm bg-[rgba(230,225,211,0.06)]" />
      <div className="mt-3 h-4 w-full rounded-sm bg-[rgba(230,225,211,0.04)]" />
      <div className="mt-2 h-4 w-5/6 rounded-sm bg-[rgba(230,225,211,0.04)]" />
      <div className="glass mt-8 h-64 rounded-lg" />
    </div>
  );
}
