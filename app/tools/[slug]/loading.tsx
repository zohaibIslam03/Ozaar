export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-20 bg-[#1a1a1a] rounded-md mb-12" />

      {/* Header skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="h-10 w-10 bg-[#1a1a1a] rounded-lg" />
        <div className="h-9 w-64 bg-[#1a1a1a] rounded-lg" />
        <div className="h-4 w-80 bg-[#1a1a1a] rounded" />
      </div>

      {/* Tool card skeleton */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 flex flex-col gap-4">
        <div className="h-10 w-full bg-[#1a1a1a] rounded-xl" />
        <div className="h-32 w-full bg-[#1a1a1a] rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#1a1a1a] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
