"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Pencil } from "lucide-react"

import { API_EVENTS, API_DELETE_EVENT } from "@/utils/endpoints/config"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  location: string
  address: string
  attendeesCount: number
  maxAttendees: number
  category: string
  description: string
  organizer: string
  imageUrl: string
  tags: string[]
}

const getCategoryBadgeColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "social":
      return "bg-pink-200 text-pink-900"
    case "trip":
      return "bg-primary text-white"
    case "cultural":
      return "bg-secondary-greenblue text-green-900"
    case "academic":
      return "bg-amber-400 text-amber-900"
    case "sports":
      return "bg-purple-200 text-purple-900"
    case "workshop":
      return "bg-yellow-200 text-yellow-900"
    case "party":
      return "bg-[#0E1E40] text-white"
    case "other":
      return "bg-gray-300 text-gray-800"
    default:
      return "bg-gray-200 text-gray-700"
  }
}

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get<Event[]>(API_EVENTS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEvents(res.data)
      } catch (err) {
        console.error("Error loading events", err)
      }
    }

    fetchEvents()
  }, [])

  const handleOpen = (event: Event) => {
    setSelectedEvent(event)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedEvent(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(API_DELETE_EVENT(selectedEvent.id), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
      handleClose()
    } catch (err) {
      console.error("Error deleting event", err)
    }
  }

  return (
    <Card className="bg-foreground border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-text">Events</CardTitle>
        <CardDescription className="text-text-secondary">
          View and manage all platform events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-800">
                <TableHead className="text-text font-semibold">Title</TableHead>
                <TableHead className="text-text font-semibold">Date</TableHead>
                <TableHead className="text-text font-semibold">Category</TableHead>
                <TableHead className="text-text font-semibold">Location</TableHead>
                <TableHead className="text-text font-semibold">Tags</TableHead>
                <TableHead className="text-text font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ev) => (
                <TableRow
                  key={ev.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-accent/10"
                >
                  <TableCell className="font-medium text-text">{ev.title}</TableCell>
                  <TableCell className="text-text">{format(new Date(ev.date), "PPp")}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeColor(ev.category)}>{ev.category}</Badge>
                  </TableCell>
                  <TableCell className="text-text max-w-[180px] truncate">
                    {ev.location} - {ev.address}
                  </TableCell>
                  <TableCell className="text-xs text-text">
                    {ev.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {ev.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-muted-foreground text-[10px] px-1.5 py-0.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right text-text">
                    <div className="flex justify-end">
                      <Dialog open={open && selectedEvent?.id === ev.id} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpen(ev)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md z-50 border border-gray-200 dark:border-gray-800">
                          <DialogHeader>
                            <DialogTitle>Delete Event</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              <span className="font-semibold text-destructive">
                                {selectedEvent?.title}
                              </span>
                              ?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="ghost" onClick={handleClose}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                              Confirm Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
