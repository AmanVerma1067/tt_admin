import { Suspense } from "react"
import { getPublicTimetable } from "@/lib/api"
import { TimetableViewer } from "@/components/timetable-viewer"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

function TimetableViewerSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

async function TimetableContent() {
  try {
    const batches = await getPublicTimetable()
    return <TimetableViewer batches={batches} />
  } catch (error) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Timetable</h2>
        <p className="text-muted-foreground">Unable to fetch timetable data. Please try again later.</p>
      </Card>
    )
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Timetable Viewer</h1>
            <p className="text-muted-foreground">Academic Schedule Overview</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<TimetableViewerSkeleton />}>
          <TimetableContent />
        </Suspense>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Timetable Viewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
