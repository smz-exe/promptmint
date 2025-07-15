import { Skeleton } from "~/components/ui/skeleton";

export function PromptCardSkeleton() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-md rounded-xl border-2 border-gray-200/50 bg-gradient-to-br from-slate-500 to-gray-600 p-6 shadow-2xl">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm" />
      
      {/* Header with rarity and category */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
          <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Fork info (optional) */}
      <div className="relative z-10 mb-3">
        <Skeleton className="h-4 w-36 bg-white/20" />
      </div>

      {/* Title */}
      <div className="relative z-10 space-y-3 mb-4">
        <Skeleton className="h-6 w-4/5 bg-white/20" />
        <Skeleton className="h-6 w-3/4 bg-white/20" />
      </div>

      {/* Description */}
      <div className="relative z-10 mb-5 space-y-2">
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-5/6 bg-white/20" />
      </div>

      {/* Prompt Preview */}
      <div className="relative z-10 mb-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
        <Skeleton className="mb-2 h-4 w-full bg-white/20" />
        <Skeleton className="mb-2 h-4 w-5/6 bg-white/20" />
        <Skeleton className="h-4 w-3/4 bg-white/20" />
      </div>

      {/* Author */}
      <div className="relative z-10 mb-4 flex items-center gap-2 border-t border-white/20 pt-4">
        <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
        <Skeleton className="h-4 w-24 bg-white/20" />
        <Skeleton className="h-4 w-1 bg-white/20" />
        <Skeleton className="h-4 w-16 bg-white/20" />
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-12 bg-white/20" />
          <Skeleton className="h-8 w-12 bg-white/20" />
          <Skeleton className="h-8 w-12 bg-white/20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 bg-white/20" />
          <Skeleton className="h-8 w-8 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
