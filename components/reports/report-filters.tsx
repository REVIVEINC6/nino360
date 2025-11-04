"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

export function ReportFilters() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  return (
    <Card className="p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select defaultValue="revenue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Analysis</SelectItem>
              <SelectItem value="hiring">Hiring Metrics</SelectItem>
              <SelectItem value="bench">Bench Utilization</SelectItem>
              <SelectItem value="client">Client Performance</SelectItem>
              <SelectItem value="vendor">Vendor Analysis</SelectItem>
              <SelectItem value="project">Project Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Group By</Label>
          <Select defaultValue="month">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </Card>
  )
}
