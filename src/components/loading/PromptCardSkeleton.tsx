import { Skeleton } from "~/components/ui/skeleton";

export function PromptCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header with rarity and category */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-12" />
      </div>

      {/* Title */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Description */}
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />

      {/* Author */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
