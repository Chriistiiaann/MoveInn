"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  getDay,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Event {
  id: number
  title: string
  date: Date
  location: string
  address: string
  attendees: number
  maxAttendees: number
  category: string
  joined: boolean
  description: string
  organizer: string
  image: string
  tags: string[]
}

interface EventCalendarViewProps {
  events: Event[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  activeFilters: string[]
}

export function EventCalendarView({ events, selectedDate, setSelectedDate, activeFilters }: EventCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate))

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const daysInMonth = eachDayOfInterval({
    start: currentMonth,
    end: endOfMonth(currentMonth),
  })

  const getEventsForDay = (day: Date) =>
    events.filter(
      (event) => isSameDay(event.date, day) && (activeFilters.length === 0 || activeFilters.includes(event.category))
    )

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "social": return "bg-pink-200 text-pink-900"
      case "trip": return "bg-[#4C69DD] text-white"
      case "cultural": return "bg-[#62C3BA] text-[#0E1E40]"
      case "academic": return "bg-amber-400 text-amber-900"
      case "sports": return "bg-purple-200 text-purple-900"
      case "workshop": return "bg-yellow-200 text-yellow-900"
      case "party": return "bg-[#0E1E40] text-white"
      case "food": return "bg-green-200 text-green-900"
      case "other": return "bg-gray-300 text-gray-800"
      default: return "bg-gray-200 text-gray-700"
    }
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const firstDayOfMonth = getDay(currentMonth)
  const emptyCellsBefore = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  return (
    <Card className="border border-border dark:border-gray-800 bg-foreground shadow-sm rounded-xl">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text dark:text-text-secondary">{format(currentMonth, "MMMM yyyy")}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 dark:border-gray-700" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4 text-text-secondary" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 dark:border-gray-700" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4 text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {weekdays.map((day) => (
            <div key={day} className="text-center font-medium text-text-secondary py-2">{day}</div>
          ))}

          {emptyCellsBefore.map((i) => (
            <div key={`empty-${i}`} className="h-24 md:h-32 p-1 bg-muted rounded-md" />
          ))}

          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`h-24 md:h-32 p-1 rounded-md cursor-pointer transition-colors border 
                  ${isSelected ? "bg-[#4C69DD]/10 border-primary" : isTodayDate ? "bg-accent/10 border-accent" : "bg-background border-border dark:border-gray-700 hover:bg-accent/10"}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    isTodayDate
                      ? "bg-accent text-accent-dark w-6 h-6 rounded-full flex items-center justify-center"
                      : isSelected
                        ? "text-[#4C69DD]"
                        : "text-text"
                  }`}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge className="bg-[#4C69DD] text-white text-[10px] px-1">{dayEvents.length}</Badge>
                  )}
                </div>

                {/* Event preview bullets */}
                <div className="space-y-1 overflow-hidden text-xs leading-tight">
                  {dayEvents.slice(0, 3).map((event) => (
                    <TooltipProvider key={event.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`truncate px-1 py-[2px] rounded ${getCategoryColor(event.category)} ${
                              event.joined ? "border-l-2 border-white" : ""
                            }`}
                          >
                            {format(event.date, "HH:mm")} {event.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background border border-border shadow-md rounded-md px-3 py-2">
                          <div className="space-y-1 text-xs text-text">
                            <p className="font-semibold">{event.title}</p>
                            <p>{format(event.date, "h:mm a")} • {event.location}</p>
                            <p>{event.attendees}/{event.maxAttendees} attending</p>
                            {event.joined && (
                              <Badge className="bg-[#B7F8C8] text-[#0E1E40] text-[10px]">You're attending</Badge>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[#4C69DD] font-medium px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-200 rounded-sm" /> Social
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4C69DD] rounded-sm" /> Trip
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#62C3BA] rounded-sm" /> Cultural
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-sm" /> Academic
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#0E1E40] rounded-sm" /> Party
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-sm" /> Food
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-200 rounded-sm" /> Sports
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 rounded-sm" /> Workshop
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
