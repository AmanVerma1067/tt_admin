"use client"

import { Calendar, Settings, Users, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { icon: Calendar, label: "Timetables", active: true },
  { icon: Users, label: "Batches", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function AdminSidebar() {
  return (
    <div className="w-64 border-r bg-muted/10 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Timetable Management</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className="w-full justify-start"
            disabled={!item.active}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <Card className="mt-8">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Batches</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
