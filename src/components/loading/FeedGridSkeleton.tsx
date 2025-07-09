import { PromptCardSkeleton } from "./PromptCardSkeleton";

export function FeedGridSkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid"
          style={{
            // Add slight height variation to simulate real cards
            height: `${200 + (index % 3) * 50}px`,
          }}
        >
          <PromptCardSkeleton />
        </div>
      ))}
    </div>
  );
}
