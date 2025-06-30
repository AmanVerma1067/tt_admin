"use client"

import { Suspense } from "react"
import { getPublicTimetable } from "@/lib/api"
import { TimetableGrid } from "@/components/timetable-grid"
import { Header } from "@/components/header"
// Removed: import { LoadingSpinner } from "@/components/loading-spinner"
// import { ErrorBoundary } from "@/components/error-boundary"

export const revalidate = 300 // Revalidate every 5 minutes

async function TimetableContent() {
  try {
    const timetableData = await getPublicTimetable()
    return <TimetableGrid data={timetableData} />
  } catch (error) {
    console.error("Failed to fetch timetable:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-semibold mb-2">Unable to Load Timetable</h2>
        <p className="text-muted-foreground mb-4">
          We're having trouble loading the timetable data. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Academic Timetable</h1>
          <p className="text-xl text-muted-foreground animate-fade-in">View schedules for all batches and courses</p>
        </div>

        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[400px]">
                {/* Removed: <LoadingSpinner size="lg" /> */}
                <span>Loading...</span>
              </div>
            }
          >
            <TimetableContent />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
