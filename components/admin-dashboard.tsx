"use client"

import { useState, useEffect } from "react"
import { getRawTimetable, updateTimetable, type Batch, WEEKDAYS, type Session } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Plus, Trash2, Save } from "lucide-react"
import toast from "react-hot-toast"

interface AdminDashboardProps {
  token: string
}

export function AdminDashboard({ token }: AdminDashboardProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [localChanges, setLocalChanges] = useState<Record<string, Batch>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
    } catch (error) {
      toast.error("Failed to load batches")
      console.error("Load batches error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentBatchData = (): Batch | null => {
    if (!selectedBatch) return null

    // Return local changes if available, otherwise original data
    if (localChanges[selectedBatch]) {
      return localChanges[selectedBatch]
    }

    return batches.find((batch) => batch.batch === selectedBatch) || null
  }

  const updateLocalBatch = (batchData: Batch) => {
    setLocalChanges((prev) => ({
      ...prev,
      [selectedBatch!]: batchData,
    }))
  }

  const addSession = (day: string) => {
    const currentBatch = getCurrentBatchData()
    if (!currentBatch) return

    const newSession: Session = {
      time: "",
      subject: "",
      room: "",
      teacher: "",
    }

    const updatedBatch = {
      ...currentBatch,
      [day]: [...(currentBatch[day] || []), newSession],
    }

    updateLocalBatch(updatedBatch)
  }

  const removeSession = (day: string, index: number) => {
    const currentBatch = getCurrentBatchData()
    if (!currentBatch) return

    const sessions = currentBatch[day] || []
    const updatedSessions = sessions.filter((_, i) => i !== index)

    const updatedBatch = {
      ...currentBatch,
      [day]: updatedSessions,
    }

    updateLocalBatch(updatedBatch)
  }

  const updateSession = (day: string, index: number, field: keyof Session, value: string) => {
    const currentBatch = getCurrentBatchData()
    if (!currentBatch) return

    const sessions = [...(currentBatch[day] || [])]
    sessions[index] = { ...sessions[index], [field]: value }

    const updatedBatch = {
      ...currentBatch,
      [day]: sessions,
    }

    updateLocalBatch(updatedBatch)
  }

  const handleSave = async () => {
    if (!selectedBatch || !localChanges[selectedBatch]) {
      toast.error("No changes to save")
      return
    }

    try {
      setSaving(true)

      // Merge local changes with existing data
      const updatedData = batches.map((batch) => {
        if (batch.batch === selectedBatch) {
          return localChanges[selectedBatch]
        }
        return batch
      })

      await updateTimetable(token, updatedData)

      // Clear local changes and reload data
      setLocalChanges((prev) => {
        const newChanges = { ...prev }
        delete newChanges[selectedBatch]
        return newChanges
      })

      await loadBatches()
      toast.success("Timetable updated successfully")
    } catch (error) {
      toast.error("Failed to save changes")
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  const hasUnsavedChanges = selectedBatch ? !!localChanges[selectedBatch] : false
  const currentBatch = getCurrentBatchData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Batches</h2>
          {hasUnsavedChanges && (
            <Badge variant="destructive" className="text-xs">
              Unsaved
            </Badge>
          )}
        </div>

        <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin">
          {batches.map((batch) => (
            <Card
              key={batch.batch}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedBatch === batch.batch ? "bg-accent border-primary" : ""
              }`}
              onClick={() => {
                if (hasUnsavedChanges) {
                  const confirm = window.confirm("You have unsaved changes. Are you sure you want to switch batches?")
                  if (!confirm) return
                }
                setSelectedBatch(batch.batch)
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Batch {batch.batch}</span>
                  {localChanges[batch.batch] && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary" className="text-xs">
                  {WEEKDAYS.filter((day) => batch[day] && batch[day].length > 0).length} days
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentBatch ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Batch {currentBatch.batch}</h1>
                  <p className="text-muted-foreground">Edit the weekly schedule</p>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving || !hasUnsavedChanges}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Timetable Editor */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
              <div className="space-y-6">
                {WEEKDAYS.map((day) => {
                  const sessions = currentBatch[day] || []

                  return (
                    <Card key={day}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{day}</CardTitle>
                          <Button
                            onClick={() => addSession(day)}
                            size="sm"
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Session</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {sessions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-sm">No sessions scheduled for {day}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sessions.map((session, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg"
                              >
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">Time</label>
                                  <Input
                                    value={session.time}
                                    onChange={(e) => updateSession(day, index, "time", e.target.value)}
                                    placeholder="e.g., 9:00-10:00"
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    Subject
                                  </label>
                                  <Input
                                    value={session.subject}
                                    onChange={(e) => updateSession(day, index, "subject", e.target.value)}
                                    placeholder="Subject name"
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">Room</label>
                                  <Input
                                    value={session.room}
                                    onChange={(e) => updateSession(day, index, "room", e.target.value)}
                                    placeholder="Room number"
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                                    Teacher
                                  </label>
                                  <Input
                                    value={session.teacher}
                                    onChange={(e) => updateSession(day, index, "teacher", e.target.value)}
                                    placeholder="Teacher name"
                                    className="text-sm"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button
                                    onClick={() => removeSession(day, index)}
                                    variant="destructive"
                                    size="sm"
                                    className="w-full md:w-auto"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold mb-2">Select a Batch</h2>
              <p className="text-muted-foreground">Choose a batch from the sidebar to edit its timetable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
