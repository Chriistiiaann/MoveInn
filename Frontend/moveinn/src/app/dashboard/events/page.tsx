"use client"

import { useState, useEffect } from "react"
import {
  Search, Filter, Calendar, List, ChevronDown, ChevronUp, Plus, Users, X,
  Music, Utensils, GraduationCap, Plane, Globe, Coffee, BookOpen, MapPin, Upload,
  CalendarOff
} from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { DetailedEventCard } from "@/components/events/detailed-event-card"
import { EventCalendarView } from "@/components/events/event-calendar-view"
import { AnimatePresence, motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { API_EVENTS, API_CREATE_EVENT } from "@/utils/endpoints/config"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/context/authcontext"


export default function EventsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState("")
  const [capacity, setCapacity] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_EVENTS)
        const data = response.data.map((event: any) => ({
          ...event,
          date: new Date(event.date) // convertir string a Date para isSameDay
        }))
        console.log(data)
        setEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }
  
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event =>
    isSameDay(event.date, selectedDate) &&
    (activeFilters.length === 0 || activeFilters.includes(event.category))
  )

  const toggleFilter = (filter: string) =>
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )

  const clearFilters = () => setActiveFilters([])

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      social: <Coffee className="h-4 w-4" />,
      trip: <Plane className="h-4 w-4" />,
      cultural: <Globe className="h-4 w-4" />,
      academic: <GraduationCap className="h-4 w-4" />,
      sports: <Users className="h-4 w-4" />,
      workshop: <BookOpen className="h-4 w-4" />,
      party: <Music className="h-4 w-4" />,
      food: <Utensils className="h-4 w-4" />
    }
    return icons[category.toLowerCase()] || <Calendar className="h-4 w-4" />
  }

  const { user } = useAuth()

  const handleCreateEvent = async () => {
    if (!user?.id) {
      alert("You must be logged in to create an event.")
      return
    }
  
    try {
      const datetime = new Date(`${date}T${time}`)
  
      const formData = new FormData()
  
      formData.append("CreatorId", user.id)
      formData.append("Title", title)
      formData.append("Date", datetime.toISOString())
      formData.append("Location", location)
      formData.append("Address", address)
      formData.append("MaxAttendees", String(Number(capacity)))
      formData.append("Category", category)
      formData.append("Description", description)
  
      if (imageFile) {
        formData.append("ImageFile", imageFile)
      }
  
      // 👉 FIX para Tags
      tags.forEach((tag, index) => {
        formData.append(`Tags[${index}]`, tag)
      })
  
      const response = await axios.post(API_CREATE_EVENT, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
  
      console.log("✅ Event created:", response.data)
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }
  
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">

        {/* Header */}
        <section className="mb-8">
          <div className="relative bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
            <div className="relative z-10 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Events & Meetups</h1>
                <p className="text-white/80 text-sm md:text-base">
                  Discover and join activities with fellow Erasmus students in Barcelona
                </p>
              </div>
              <Button
                className="bg-[#B7F8C8] text-[#0E1E40] hover:bg-[#B7F8C8]/90 font-semibold"
                onClick={() => setShowCreateEvent(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            {/* Filters & Tabs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search events..."
                  className="pl-10 bg-white/10 text-white border-white/20 placeholder:text-white/60 focus:bg-white/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-white bg-white/10 border-white/20 hover:bg-white/10">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-foreground border-white/20 text-primary-dark">
                    <DropdownMenuLabel>Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {["Social", "Trip", "Cultural", "Academic", "Sports", "Workshop"].map(cat => (
                      <DropdownMenuItem key={cat} onClick={() => toggleFilter(cat)}>
                        {getCategoryIcon(cat)} <span className="ml-2">{cat}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Tabs defaultValue="list">
                  <TabsList className="bg-white/10 border border-white/20">
                    <TabsTrigger
                      value="list"
                      onClick={() => setViewMode("list")}
                      className="data-[state=active]:bg-background dark:data-[state=active]:bg-primary data-[state=active]:text-[#0E1E40] text-white"
                    >
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="calendar"
                      onClick={() => setViewMode("calendar")}
                      className="data-[state=active]:bg-background dark:data-[state=active]:bg-primary data-[state=active]:text-[#0E1E40] text-white"
                    >
                      <Calendar className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        <div
          className="flex items-center justify-between cursor-pointer rounded-lg px-4 py-3 mb-6 transition-colors duration-200 bg-gradient-to-r from-accent-light dark:from-accent/70 to-foreground hover:bg-accent/80 border border-dashed border-accent"
          onClick={() => setShowCreateEvent(prev => !prev)}
        >
          <div className="flex items-center gap-2">
            {showCreateEvent ? (
              <ChevronUp className="h-4 w-4 text-[#0E1E40]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#0E1E40]" />
            )}
            <span className="text-sm font-medium text-[#0E1E40]">
              {showCreateEvent ? "Hide Event Form" : "Create New Event"}
            </span>
          </div>
        </div>

        {/* Formulario con animación */}
        <AnimatePresence>
          {showCreateEvent && (
            <motion.div
              key="eventForm"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border border-primary rounded-xl shadow p-6 mb-8 bg-foreground text-text">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-secondary">Create a New Event</h2>
                </div>

                <Input placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Event Image</label>
                  <div
                    className="border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center bg-background hover:bg-muted/30 cursor-pointer transition"
                    onClick={() => document.getElementById("event-image-input")?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1 text-center">
                      Drag and drop an image here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400 text-center">Recommended size: 1200 x 600 pixels</p>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 rounded-md max-h-40 object-contain border"
                      />
                    )}
                    <input
                      type="file"
                      id="event-image-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setImageFile(file)
                          setImagePreview(URL.createObjectURL(file))
                        }
                      }}
                      hidden
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Describe your event..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mb-4 rounded-md border border-border text-sm p-3 resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="mb-4" />
                <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select value={category} onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Social", "Trip", "Cultural", "Academic", "Sports", "Workshop", "Party", "Food"].map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Max Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />

                </div>

                <div className="mb-4">
  <label className="text-sm font-medium text-text-secondary block mb-1">Tags (max 3)</label>
  <div className="flex gap-2">
    <Input
      placeholder="Add a tag and press Enter"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          const trimmed = tagInput.trim()
          if (trimmed && !tags.includes(trimmed) && tags.length < 3) {
            setTags([...tags, trimmed])
            setTagInput("")
          }
        }
      }}
    />
  </div>
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag) => (
      <Badge
        key={tag}
        variant="outline"
        className="text-xs py-1 px-2 flex items-center gap-1 bg-muted text-muted-foreground"
      >
        {tag}
        <X className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((t) => t !== tag))} />
      </Badge>
    ))}
  </div>
</div>


                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowCreateEvent(false)}>Cancel</Button>
                  <Button
                    className="bg-primary text-white hover:bg-primary/80"
                    onClick={handleCreateEvent}
                  >
                    Create Event
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selector de fecha */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
          {next7Days.map((date, i) => (
            <Button
              key={i}
              variant={isSameDay(date, selectedDate) ? "default" : "outline"}
              className={`flex-shrink-0 h-fit w-20 text-sm ${
                isSameDay(date, selectedDate)
                  ? "bg-[#4C69DD] text-white"
                  : "bg-foreground text-primary-dark hover:bg-background dark:border-gray-800"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex flex-col items-center">
                <span>{i === 0 ? "Today" : format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                <span>{format(date, "MMM")}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Lista o calendario */}
        {viewMode === "list" ? (
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <DetailedEventCard key={event.id} event={event} categoryIcon={getCategoryIcon(event.category)} />
              ))
            ) : (
              <div className="text-center py-12 bg-foreground rounded-lg">
                <CalendarOff className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
                <h3 className="text-xl font-medium text-text-secondary mb-2">No events found</h3>
                <p className="text-text max-w-md mx-auto mb-6">Try changing your filters or date.</p>
                <Button onClick={clearFilters} className="text-white">Clear filters</Button>
              </div>
            )}
          </div>
        ) : (
          <EventCalendarView
            events={events}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            activeFilters={activeFilters}
          />
        )}
      </main>
    </div>
  )
}
