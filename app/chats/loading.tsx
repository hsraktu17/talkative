import { Skeleton } from "@/components/ui/skeleton"

export default function ChatsLoading() {
  return (
    <div className="w-full h-screen bg-[#f7f8fa] flex flex-col">
      <div className="flex flex-1 min-h-0">
        <aside className="w-80 border-r p-4 space-y-4 bg-white">
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </aside>
        <div className="flex-1 p-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className={i % 2 ? "h-6 ml-auto w-2/3" : "h-6 w-1/2"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
