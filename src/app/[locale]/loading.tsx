export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12 animate-pulse">
      {/* Eyebrow skeleton */}
      <div className="h-3 w-24 rounded-full bg-canvas-raised" />
      {/* Heading skeleton */}
      <div className="mt-4 h-10 w-72 rounded-2xl bg-canvas-raised" />
      {/* Subtitle skeleton */}
      <div className="mt-3 h-4 w-48 rounded-full bg-canvas-raised" />
      {/* Card skeletons */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-[24px] border border-app bg-surface" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="mt-8 space-y-3">
        <div className="h-20 rounded-[24px] border border-app bg-surface" />
        <div className="h-20 rounded-[24px] border border-app bg-surface" />
      </div>
    </div>
  )
}
