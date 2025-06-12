"use client"

import { useState, useEffect, JSX } from "react"
import {
  Search, Filter, Calendar, List, ChevronDown, ChevronUp, Plus, Users, X,
  Music, Utensils, GraduationCap, Plane, Globe, Coffee, BookOpen, MapPin, Upload,
  CalendarOff
} from "lucide-react"
import { format, addDays, isSameDay, isAfter } from "date-fns"
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
import { API_EVENTS, API_CREATE_EVENT, API_GET_USER_EVENTS, API_SEARCH_EVENTS, API_EVENTS_COUNTRIES, API_EVENTS_CITIES } from "@/utils/endpoints/config"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/context/authcontext"
import { toast } from "sonner"
import { getCookie } from "cookies-next"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import Flag from "react-world-flags"
import { CountrySearch, CitySearch } from "@/components/ui/country-city-search"

countries.registerLocale(enLocale)

const getCountryCode = (countryName: string) => {
  return countries.getAlpha2Code(countryName, "en") || "UN"
}


export default function EventsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [userClickedDate, setUserClickedDate] = useState(false)


  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState("")
  const [capacity, setCapacity] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  const [query, setQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [sortField, setSortField] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [countrySearch, setCountrySearch] = useState("")

  const { user } = useAuth()

  const filteredCountries = availableCountries
  .filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))
  .map(name => ({
    name,
    code: getCountryCode(name)
  }))
  .filter(c => c.code !== "UN")

  useEffect(() => {
    // Si el usuario cambia a la vista de calendario, levantamos el límite (por ejemplo, 9999)
    // Si vuelve a lista, lo bajamos a 5
    if (viewMode === "calendar") {
      setLimit(9999)
      setPage(1) // opcional: para asegurar que obtienes todo desde el principio
    } else {
      setLimit(5)
    }
  }, [viewMode])
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = getCookie("token")
        const res = await axios.get(API_EVENTS_COUNTRIES, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCountries(res.data)
      } catch (error) {
        console.error("Error loading countries:", error)
      }
    }
  
    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setAvailableCities([])
        setSelectedCity("")
        return
      }
  
      try {
        const token = getCookie("token")
        const res = await axios.get(API_EVENTS_CITIES(selectedCountry), {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCities(res.data)
      } catch (error) {
        console.error("Error loading cities:", error)
        setAvailableCities([])
      }
    }
  
    fetchCities()
  }, [selectedCountry])
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = getCookie("token")
        const res = await axios.get(API_EVENTS_COUNTRIES, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCountries(res.data)
      } catch (err) {
        console.error("Error fetching countries:", err)
      }
    }
  
    fetchCountries()
  }, [])
  
  const fetchFilteredEvents = async () => {
    try {
      setIsLoadingEvents(true)
      const token = getCookie("token")
  
      const payload: any = {
        page,
        limit,
        query: query || "",
        location: locationFilter || "",
        city: selectedCity || "",
        country: selectedCountry || "",
        category: categoryFilter || "",
        tags: tagFilter,
        sortField: sortField || "",
        sortOrder: sortOrder || "",
        currentUserId: user?.id || ""
      }
  
      const res = await axios.post(API_SEARCH_EVENTS, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      const formattedEvents = res.data.items.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }))
  
      setEvents(formattedEvents)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setIsLoadingEvents(false)
    }
  }
  

  useEffect(() => {  
    if (user?.id) {
      fetchFilteredEvents()
    }
  }, [query, locationFilter, categoryFilter, tagFilter, sortField, sortOrder, page, limit, selectedCountry, selectedCity, user?.id])
  
  
  const filteredEvents = events.filter(event => {
    const matchDate = userClickedDate ? isSameDay(event.date, selectedDate) : true;
    const matchCategory = activeFilters.length === 0 || activeFilters.includes(event.category);
    return matchDate && matchCategory;
  })
  
  

  const toggleFilter = (filter: string) =>
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )

  const clearFilters = () => setActiveFilters([])

  const next7Days = Array.from(
    new Set(
      events
        .filter(e => isAfter(e.date, new Date()) || isSameDay(e.date, new Date()))
        .map(e => e.date.toDateString())
    )
  )
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime())
    .slice(0, 7)

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

  const handleCreateEvent = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to create an event.")
      return
    }
  
    const requiredFields = {
      title,
      description,
      date,
      time,
      location,
      address,
      country,
      city,
      category,
      capacity,
      imageFile,
    }
  
    const missing = Object.entries(requiredFields)
      .filter(([_, value]) => !value || (typeof value === "string" && value.trim() === ""))
      .map(([key]) => key)
  
    if (missing.length > 0) {
      toast.error("Please fill in all required fields and upload an image.")
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
      formData.append("Country", country)
      formData.append("City", city)
      formData.append("MaxAttendees", String(Number(capacity)))
      formData.append("Category", category)
      formData.append("Description", description)
      if (imageFile) formData.append("ImageFile", imageFile)
      tags.forEach((tag, index) => {
        formData.append(`Tags[${index}]`, tag)
      })
  
      const response = await axios.post(API_CREATE_EVENT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
  
      const newEvent = {
        ...response.data,
        date: new Date(response.data.date),
      }
  
      setEvents((prev) => [newEvent, ...prev])
  
      setTitle("")
      setDescription("")
      setDate("")
      setTime("")
      setLocation("")
      setAddress("")
      setCategory("")
      setCapacity("")
      setImageFile(null)
      setImagePreview(null)
      setTags([])
      setTagInput("")
  
      setShowCreateEvent(false)
  
      toast.success("Event created successfully!")
      await fetchFilteredEvents()

    } catch (error: any) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event.")
    }
  }  
  
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">

        {/* Header */}
        <section className="mb-8">
          <div className="relative bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white overflow-hidden">
            {/* <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" /> */}
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
                onClick={() => setShowCreateEvent(prev => !prev)}
              >
                {showCreateEvent ? (
                  <X className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {showCreateEvent ? "Close Form" : "Create Event"}
              </Button>
            </div>

            {/* Filters & Tabs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search events..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10 bg-white/10 text-white border-white/20 placeholder:text-white/60 focus:bg-white/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
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
              <ChevronUp className="h-4 w-4 text-text" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text" />
            )}
            <span className="text-sm font-medium text-text">
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border border-primary rounded-xl shadow p-6 mb-8 bg-foreground text-text">
        <h2 className="text-xl font-bold text-text mb-4">Create a New Event</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Erasmus Welcome Party"
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Max Capacity</label>
            <Input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 100"
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sala Apolo"
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Carrer Nou de la Rambla 113"
              className="text-primary-dark text-sm border border-primary dark:border-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
            <CountrySearch
              value={country}
              onChange={(val) => {
                setCountry(val)
                setCity("") // Resetear ciudad si cambia país
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
            <CitySearch
              value={city}
              onChange={setCity}
              country={country}
            />
          </div>
        </div>


        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border border-primary dark:border-text-secondary">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="text-text border border-primary dark:border-text-secondary">
              {["Social", "Trip", "Cultural", "Academic", "Sports", "Workshop", "Party", "Food"].map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe your event..."
            className="w-full rounded-md border border-primary dark:border-text-secondary text-primary-dark text-sm p-3 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">Upload Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }
            }}
            className="w-full rounded-md border border-primary dark:border-text-secondary text-primary-dark text-sm p-2 bg-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-[#3b5ccd]"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 rounded-md max-h-40 object-contain border"
            />
          )}
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
            disabled={tags.length >= 3}
            className={`text-primary-dark text-sm border ${
              tags.length >= 3 ? "opacity-50 cursor-not-allowed" : "border-primary dark:border-text-secondary"
            } focus:ring-2 focus:ring-primary focus:outline-none`}
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
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="ml-1 text-muted-foreground hover:text-red-500 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
            ))}
          </div>
          {tags.length >= 3 && (
            <p className="text-xs text-red-500 mt-1">You can only add up to 3 tags.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" className="hover:bg-red-600" onClick={() => setShowCreateEvent(false)}>Cancel</Button>
          <Button
            className="bg-[#4C69DD] hover:bg-[#3b5ccd] text-white"
            onClick={handleCreateEvent}
          >
            Create Event
          </Button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Bloque de países con banderas y búsqueda */}
<section className="mb-6">
  <div className="bg-foreground p-4 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-2 text-text">Filter by Country</h2>

    <Input
      placeholder="Search countries..."
      value={countrySearch}
      onChange={(e) => setCountrySearch(e.target.value)}
      className="mb-4 text-sm border-primary dark:border-text-secondary text-text"
    />

    <div className={`flex flex-wrap gap-2 ${filteredCountries.length > 12 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
      {filteredCountries.map((country) => (
        <Button
          key={country.name}
          variant="outline"
          className={`
            flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all
            ${selectedCountry === country.name
              ? "bg-[#4C69DD]/10 text-text border-2 border-primary dark:border-text-secondary font-semibold"
              : "bg-gray-100 dark:bg-background border-none text-text hover:border-[#4C69DD]"}
          `}
          onClick={() => {
            const newCountry = selectedCountry === country.name ? "" : country.name
            setSelectedCountry(newCountry)
            setPage(1)
          }}
        >
          <Flag code={getCountryCode(country.name)} style={{ width: 20, height: 14 }} />
          {country.name}
        </Button>
      ))}
    </div>
  </div>
</section>


<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium text-text mb-1">City</label>
    <select
      className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text bg-foreground"
      value={selectedCity}
      onChange={(e) => {
        setSelectedCity(e.target.value)
        setPage(1)
      }}
      disabled={availableCities.length === 0}
    >
      <option value="">All Cities</option>
      {availableCities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-text mb-1">Category</label>
    <select
      value={categoryFilter}
      onChange={(e) => {
        setCategoryFilter(e.target.value)
        setPage(1)
      }}
      className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text bg-foreground"
    >
      <option value="">All Categories</option>
      <option value="social">Social</option>
      <option value="trip">Trip</option>
      <option value="cultural">Cultural</option>
      <option value="academic">Academic</option>
      <option value="sports">Sports</option>
      <option value="workshop">Workshop</option>
      <option value="party">Party</option>
      <option value="food">Food</option>
    </select>
  </div>
</section>


{userClickedDate && (
  <div className="mb-2">
    <Button
      variant="outline"
      onClick={() => {
        setUserClickedDate(false)
        setSelectedDate(new Date(0))
        setPage(1)
      }}
      className="text-sm bg-background border border-primary text-primary hover:bg-primary hover:text-white transition"
    >
      Clear selected date
    </Button>
  </div>
)}


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
              onClick={() => {
                setSelectedDate(date)
                setUserClickedDate(true)
              }}
            >
              <div className="flex flex-col items-center">
                <span>{isSameDay(date, new Date()) ? "Today" : format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                <span>{format(date, "MMM")}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Lista o calendario */}
        {viewMode === "list" ? (
  <div className="grid gap-4">
    {isLoadingEvents ? (
      <div className="flex justify-center items-center min-h-[200px] col-span-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ) : filteredEvents.length > 0 ? (
      filteredEvents.map((event: any) => (
        <div key={event.id} className="relative">
          <DetailedEventCard event={event} categoryIcon={getCategoryIcon(event.category)} />
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
        <CalendarOff className="h-12 w-12 text-primary" />
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
    setSelectedDate={(date) => {
      setSelectedDate(date)
      setUserClickedDate(true)
      setPage(1)
      setViewMode("list")
    }}
    activeFilters={activeFilters}
  />
)}

            </main>
            {!userClickedDate && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i + 1)}
              variant={i + 1 === page ? "default" : "outline"}
              className={`border-primary dark:border-text-secondary text-primary dark:text-text min-w-[36px] h-9 px-3 py-1 text-sm ${i + 1 === page ? "bg-primary text-white" : ""}`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
