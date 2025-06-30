"use client"

import { useState, useEffect } from "react"
import { getRawTimetable, type Batch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AdminSidebarProps {
  token: string
}

export function AdminSidebar({ token }: AdminSidebarProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBatches()
  }, [token])

  const loadBatches = async () => {
    try {
      setLoading(true)
      const data = await getRawTimetable(token)
      setBatches(data)
      if (data.length > 0 && !selectedBatch) {
        setSelectedBatch(data[0].batch)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load batches")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-80 border-r bg-muted/10 p-4">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-80 border-r bg-muted/10 p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-sm">{error}</p>
              <button onClick={loadBatches} className="mt-2 text-xs text-primary hover:underline">
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Batches</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-2">
            {batches.map((batch) => (
              <Card
                key={batch.batch}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedBatch === batch.batch ? "bg-accent border-primary" : ""
                }`}
                onClick={() => setSelectedBatch(batch.batch)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Batch {batch.batch}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    {
                      Object.keys(batch).filter(
                        (key) => key !== "batch" && Array.isArray(batch[key]) && batch[key].length > 0,
                      ).length
                    }{" "}
                    days
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
