"use client"

import { useState } from "react"
import type { Batch } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, MapPin, User } from "lucide-react"

interface TimetableViewerProps {
  batches: Batch[]
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

export function TimetableViewer({ batches }: TimetableViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBatches = batches.filter((batch) =>
    (batch.batch ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredBatches.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm ? "No batches found matching your search." : "No timetable data available."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBatches.map((batch) => (
            <Card key={batch.batch} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  {batch.batch}
                  <Badge variant="secondary">
                    {weekdays.reduce((total, day) => total + (batch[day]?.length || 0), 0)} sessions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {weekdays.map((day) => {
                    const sessions = batch[day] || []
                    if (sessions.length === 0) return null

                    return (
                      <AccordionItem key={day} value={day}>
                        <AccordionTrigger className="text-sm font-medium">
                          <div className="flex items-center justify-between w-full mr-2">
                            <span>{day}</span>
                            <Badge variant="outline" className="text-xs">
                              {sessions.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {sessions.map((session, index) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <Clock className="h-3 w-3" />
                                  {session.time}
                                </div>
                                <div className="text-sm font-semibold text-primary">{session.subject}</div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {session.room}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {session.teacher}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
