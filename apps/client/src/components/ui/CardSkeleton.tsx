/** Loading placeholder shaped like DestinationCard / PackageCard so the grid
 * doesn't jump when the data arrives. */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone/10 bg-white" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-sand/40" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/4 animate-pulse rounded bg-sand/40" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-sand/40" />
        <div className="h-3 w-full animate-pulse rounded bg-sand/30" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-sand/30" />
      </div>
    </div>
  );
}
