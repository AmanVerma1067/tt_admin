"use client"

import { useState } from "react"
import { type Batch, WEEKDAYS } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, BookOpen } from "lucide-react"

interface TimetableGridProps {
  data: Batch[]
}

export function TimetableGrid({ data }: TimetableGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter((batch) => batch.batch.toLowerCase().includes(searchTerm.toLowerCase()))

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-semibold mb-2">No Timetable Data</h2>
        <p className="text-muted-foreground">No timetable information is currently available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Batch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((batch, index) => (
          <Card
            key={batch.batch}
            className="animate-fade-in hover:shadow-lg transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Batch {batch.batch}</span>
                <Badge variant="secondary">
                  {WEEKDAYS.filter((day) => batch[day] && batch[day].length > 0).length} days
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {WEEKDAYS.map((day) => {
                  const sessions = batch[day] || []
                  if (sessions.length === 0) return null

                  return (
                    <AccordionItem key={day} value={day}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-2">
                          <span className="font-medium">{day}</span>
                          <Badge variant="outline" className="ml-2">
                            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {sessions.map((session, sessionIndex) => (
                            <div key={sessionIndex} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{session.time}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{session.room}</span>
                                </div>
                                <div className="flex items-center space-x-2 col-span-2">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-primary">{session.subject}</span>
                                </div>
                                <div className="flex items-center space-x-2 col-span-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{session.teacher}</span>
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

              {WEEKDAYS.every((day) => !batch[day] || batch[day].length === 0) && (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">No sessions scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
          <p className="text-muted-foreground">No batches match your search term "{searchTerm}".</p>
        </div>
      )}
    </div>
  )
}
