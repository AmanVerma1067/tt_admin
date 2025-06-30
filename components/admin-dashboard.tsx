"use client"

import { useState } from "react"
import type { Batch, Session } from "@/lib/types"
import { updateTimetable } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"

interface AdminDashboardProps {
  initialBatches: Batch[]
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

export function AdminDashboard({ initialBatches }: AdminDashboardProps) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches)
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.batch || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const currentBatch = batches.find((b) => b.batch === selectedBatch)

  const updateSession = (day: keyof Batch, sessionIndex: number, field: keyof Session, value: string) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.batch !== selectedBatch) return batch

        const sessions = [...((batch[day] as Session[]) || [])]
        sessions[sessionIndex] = { ...sessions[sessionIndex], [field]: value }

        return { ...batch, [day]: sessions }
      }),
    )
  }

  const addSession = (day: keyof Batch) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.batch !== selectedBatch) return batch

        const sessions = [...((batch[day] as Session[]) || [])]
        sessions.push({ time: "", subject: "", room: "", teacher: "" })

        return { ...batch, [day]: sessions }
      }),
    )
  }

  const removeSession = (day: keyof Batch, sessionIndex: number) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.batch !== selectedBatch) return batch

        const sessions = [...((batch[day] as Session[]) || [])]
        sessions.splice(sessionIndex, 1)

        return { ...batch, [day]: sessions }
      }),
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1]

      if (!token) {
        throw new Error("No authentication token found")
      }

      await updateTimetable(token, batches)
      toast({
        title: "Success",
        description: "Timetable updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update timetable",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!currentBatch) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No batches available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Edit Timetable</h2>
          <p className="text-muted-foreground">Manage sessions for {selectedBatch}</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Batches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {batches.map((batch) => (
              <Button
                key={batch.batch}
                variant={selectedBatch === batch.batch ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedBatch(batch.batch)}
              >
                {batch.batch}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="Monday" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {weekdays.map((day) => (
                <TabsTrigger key={day} value={day} className="text-xs">
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {weekdays.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{day} Sessions</h3>
                  <Button onClick={() => addSession(day)} size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Session
                  </Button>
                </div>

                <div className="space-y-4">
                  {((currentBatch[day] as Session[]) || []).map((session, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`time-${day}-${index}`}>Time</Label>
                            <Input
                              id={`time-${day}-${index}`}
                              value={session.time}
                              onChange={(e) => updateSession(day, index, "time", e.target.value)}
                              placeholder="e.g., 9:00-10:00"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`subject-${day}-${index}`}>Subject</Label>
                            <Input
                              id={`subject-${day}-${index}`}
                              value={session.subject}
                              onChange={(e) => updateSession(day, index, "subject", e.target.value)}
                              placeholder="Subject name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`room-${day}-${index}`}>Room</Label>
                            <Input
                              id={`room-${day}-${index}`}
                              value={session.room}
                              onChange={(e) => updateSession(day, index, "room", e.target.value)}
                              placeholder="Room number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`teacher-${day}-${index}`}>Teacher</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`teacher-${day}-${index}`}
                                value={session.teacher}
                                onChange={(e) => updateSession(day, index, "teacher", e.target.value)}
                                placeholder="Teacher name"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeSession(day, index)}
                                className="shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {((currentBatch[day] as Session[]) || []).length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No sessions for {day}</p>
                      <Button onClick={() => addSession(day)} variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Session
                      </Button>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
