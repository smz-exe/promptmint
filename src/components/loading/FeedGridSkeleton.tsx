import { PromptCardSkeleton } from "./PromptCardSkeleton";

export function FeedGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex justify-center">
          <PromptCardSkeleton />
        </div>
      ))}
    </div>
  );
}
