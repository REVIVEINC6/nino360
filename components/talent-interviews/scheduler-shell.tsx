"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { findSlots } from "@/app/(dashboard)/talent/interviews/actions"

interface SchedulerShellProps {
  onSchedule?: (slot: any) => void
}

export function SchedulerShell({ onSchedule }: SchedulerShellProps) {
  const [panelIds, setPanelIds] = useState<string[]>([])
  const [duration, setDuration] = useState(60)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleFindSlots = async () => {
    if (panelIds.length === 0 || !dateFrom || !dateTo) return

    setLoading(true)
    try {
      const result = await findSlots({
        panel_user_ids: panelIds,
        durationMins: duration,
        from: dateFrom,
        to: dateTo,
      })
      setSlots(result)
    } catch (error) {
      console.error("[v0] Error finding slots:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Slot Finder */}
      <Card className="border-violet-500/20 bg-gradient-to-br from-background to-violet-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-500" />
            Find Available Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Panel Members</Label>
            <Input placeholder="Select panel members..." />
            <p className="text-xs text-muted-foreground">Add interviewers to check availability</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleFindSlots} disabled={loading} className="w-full">
            {loading ? "Finding..." : "Find Slots"}
          </Button>
        </CardContent>
      </Card>

      {/* Right: Suggested Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            Suggested Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No slots found. Adjust your criteria and try again.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg hover:border-violet-500/50 transition-colors cursor-pointer"
                  onClick={() => onSchedule?.(slot)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(slot.start).toLocaleString()}</span>
                    </div>
                    <Badge
                      variant={slot.conflicts.length === 0 ? "default" : "secondary"}
                      className={
                        slot.conflicts.length === 0
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }
                    >
                      Score: {slot.score}
                    </Badge>
                  </div>
                  {slot.conflicts.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-3 w-3" />
                      <span>{slot.conflicts.length} conflict(s)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
