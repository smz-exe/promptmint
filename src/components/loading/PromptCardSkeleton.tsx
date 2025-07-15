import { Skeleton } from "~/components/ui/skeleton";

export function PromptCardSkeleton() {
  return (
    <div className="mx-auto h-[360px] w-full max-w-md rounded-xl border-2 border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-gray-50/30 p-6 shadow-lg">
      {/* Header with rarity and category */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Fork info (optional) */}
      <div className="mb-3">
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Title */}
      <Skeleton className="mb-3 h-6 w-4/5" />
      <Skeleton className="mb-4 h-6 w-3/4" />

      {/* Description */}
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-5 h-4 w-5/6" />

      {/* Prompt Preview */}
      <div className="mb-4 rounded-lg border border-gray-200 p-4">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Author */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
