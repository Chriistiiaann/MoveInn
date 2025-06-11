"use client"

import { useState } from "react"
import Image from "next/image"
import axios from "axios"
import { format } from "date-fns"
import {
  MapPin, Calendar, Clock, Users, Share2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { API_BASE_IMAGE_URL, API_JOIN_EVENT, API_LEAVE_EVENT } from "@/utils/endpoints/config"
import { useAuth } from "@/context/authcontext"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"


interface Event {
  id: string
  title: string
  date: Date
  location: string
  address: string
  attendeesCount: number
  maxAttendees: number
  category: string
  joined: boolean
  description: string
  imageUrl: string
  tags: string[]
  city: string
  country: string
  creatorId: string
  creatorName: string
  creatorLastName: string
  creatorAvatarUrl: string
}

interface DetailedEventCardProps {
  event: Event
  categoryIcon: React.ReactNode
}

export function DetailedEventCard({ event, categoryIcon }: DetailedEventCardProps) {
  const { user } = useAuth()

  const [isJoining, setIsJoining] = useState(false)
  const [joined, setJoined] = useState(event.joined)
  const [attendeesCount, setAttendeesCount] = useState(event.attendeesCount)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const confirmLeaveEvent = async () => {
    if (!user?.id) return
  
    setIsJoining(true)
  
    try {
      await axios.post(API_LEAVE_EVENT(event.id, user.id))
      setJoined(false)
      toast.error(`You left "${event.title}".`, { duration: 3000 })
      setAttendeesCount(prev => prev - 1)
    } catch (error) {
      console.error("Error leaving event:", error)
    } finally {
      setIsJoining(false)
      setShowLeaveModal(false)
    }
  }


  const handleJoinLeave = async () => {
    if (!user?.id) return

    setIsJoining(true)

    try {
      if (joined) {
        await axios.post(API_LEAVE_EVENT(event.id, user.id))
        setJoined(false)
        setAttendeesCount(prev => prev - 1)
        toast.error(`You left "${event.title}".`, { duration: 3000 })
      } else {
        await axios.post(API_JOIN_EVENT(event.id, user.id))
        setJoined(true)
        setAttendeesCount(prev => prev + 1)
        toast.success(`You joined "${event.title}"!`, { duration: 3000 })
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const getCategoryColor = () => {
    switch (event.category.toLowerCase()) {
      case "social": return "from-pink-100 dark:from-pink-200/40 to-foreground"
      case "trip": return "from-[#4C69DD]/20 to-foreground"
      case "cultural": return "from-[#62C3BA]/30 to-foreground"
      case "academic": return "from-amber-200 dark:from-[#723917]/50 to-foreground"
      case "sports": return "from-purple-100 dark:from-[#ccb1ef]/50 to-foreground"
      case "workshop": return "from-yellow-100 dark:from-yellow-200/40 to-foreground"
      case "party": return "from-[#0E1E40]/30 dark:from-[#0E1E40]/50 to-foreground"
      case "food": return "from-green-200 dark:from-green-200/40 to-foreground"
      case "other": return "from-gray-200 dark:from-gray-400/20 to-foreground"
      default: return "from-gray-200 to-foreground"
    }
  }

  const getCategoryBadgeColor = () => {
    switch (event.category.toLowerCase()) {
      case "social": return "bg-pink-200 text-pink-900"
      case "trip": return "bg-primary text-white"
      case "cultural": return "bg-secondary-greenblue text-green-900"
      case "academic": return "bg-amber-400 text-amber-900"
      case "sports": return "bg-purple-200 text-purple-900"
      case "workshop": return "bg-yellow-200 text-yellow-900"
      case "party": return "bg-[#0E1E40] text-white"
      case "other": return "bg-gray-300 text-gray-800"
      case "food": return "bg-green-200 text-green-900"
      default: return "bg-gray-200 text-gray-700"
    }
  }

  const getCategoryColorBorder = () => {
    switch (event.category.toLowerCase()) {
      case "social": return "border-pink-500"
      case "trip": return "border-primary"
      case "cultural": return "border-secondary-greenblue"
      case "academic": return "border-amber-400"
      case "sports": return "border-purple-500"
      case "workshop": return "border-yellow-500"
      case "party": return "border-[#0E1E40]"
      case "other": return "border-gray-500"
      case "food": return "border-green-500"
      default: return "border-gray-500"
    }
  }

  const attendancePercentage = (attendeesCount / event.maxAttendees) * 100
  const isAlmostFull = attendancePercentage >= 80
  const isToday = new Date().toDateString() === event.date.toDateString()

  return (
    <Card className={`overflow-hidden shadow-md hover:shadow-lg border-none transition-all duration-300 bg-foreground py-0 ${showFullDescription ? "min-h-[auto]" : "min-h-[270px]"}`}>
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative h-48 md:h-auto md:w-1/3">
          <Image
            unoptimized
            src={`${API_BASE_IMAGE_URL}${event.imageUrl}` || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className={getCategoryBadgeColor()}>
              <span className="flex items-center">
                {categoryIcon}
                <span className="ml-1">{event.category}</span>
              </span>
            </Badge>
            {isToday && <Badge className="bg-red-500 text-white animate-pulse">Today</Badge>}
          </div>
        </div>

        <div className={`flex-1 bg-gradient-to-br ${getCategoryColor()} border-l-4 ${getCategoryColorBorder()}`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-text mb-2">{event.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start dark:bg-foreground/70 rounded-lg px-2 py-1">
                    <div className="p-1 bg-background/70 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <Calendar className="h-4 w-4 text-primary dark:text-text-secondary" />
                    </div>
                    <span className="text-sm text-text px-2 py-1 rounded-full">
                      {format(event.date, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-start dark:bg-foreground/70 rounded-lg px-2 py-1">
                    <div className="p-1 bg-background/70 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-primary dark:text-text-secondary" />
                    </div>
                    <span className="text-sm text-text px-2 py-1 rounded-full">{format(event.date, "h:mm a")}</span>
                  </div>

                  <div className="flex items-start dark:bg-foreground/70 rounded-lg px-2 py-1">
                    <div className="p-1 bg-background/70 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <MapPin className="h-4 w-4 text-primary dark:text-text-secondary" />
                    </div>
                    <div className="px-2 py-1 rounded-md">
                      <span className="text-sm text-text block">{event.location}</span>
                      <span className="text-xs text-text-secondary block">{event.address}</span>
                      {(event.city || event.country) && (
                        <span className="text-md text-primary font-semibold dark:text-text block">
                          {event.city}{event.city && event.country ? ', ' : ''}{event.country}
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="flex items-start dark:bg-foreground/70 rounded-full px-2 py-1">
                    <div className="p-1 bg-background/70 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <Users className="h-4 w-4 text-primary dark:text-text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-text">
                          {attendeesCount} / {event.maxAttendees} attendees
                        </span>
                        <span className={`text-xs ${isAlmostFull ? "text-amber-600 font-medium" : "text-text"}`}>
                          {isAlmostFull ? "Almost full!" : `${event.maxAttendees - attendeesCount} spots left`}
                        </span>
                      </div>
                      <Progress
                        value={attendancePercentage}
                        className="h-1.5"
                        indicatorClassName={`${isAlmostFull ? "bg-amber-500" : "bg-[#4C69DD]"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative mb-3">
                  <div
                    className={`text-sm text-text overflow-hidden transition-all duration-300 dark:bg-foreground/70 px-2 py-1 rounded-md ${
                      showFullDescription ? "max-h-64 overflow-y-auto pr-2" : "line-clamp-3"
                    }`}
                  >
                    {event.description}
                  </div>
                  {event.description.length > 160 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-1 text-sm text-primary dark:text-text-secondary flex items-center hover:underline focus:outline-none"
                    >
                      {showFullDescription ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>


                <div className="flex flex-wrap gap-1 mb-2">
                  {event.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs py-0 px-1.5 border-accent-dark text-accent-dark dark:border-accent dark:text-accent"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-text bg-background/70 dark:bg-foreground px-2 py-1 rounded-full">
                  Organized by{" "}
                  <span className="font-medium text-primary dark:text-text-secondary">
                    {event.creatorName} {event.creatorLastName}
                  </span>
                  {event.creatorAvatarUrl && !event.creatorAvatarUrl.includes("default-avatar-url") ? (
                    <Image
                      src={API_BASE_IMAGE_URL + event.creatorAvatarUrl}
                      alt={`${event.creatorName} ${event.creatorLastName}`}
                      width={24}
                      height={24}
                      className="inline-block rounded-full ml-2 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full ml-2 bg-primary text-white text-[10px] font-semibold leading-none"
                      title={`${event.creatorName} ${event.creatorLastName}`}
                    >
                      {event.creatorName?.charAt(0).toUpperCase() ?? "?"}
                    </div>

                  )}

                </div>
              </div>

              <div className="flex flex gap-2 md:w-32">
              {joined ? (
                <Button
                  variant="default"
                  className="bg-secondary text-green-900 px-3 h-8 hover:bg-secondary/80"
                  onClick={() => setShowLeaveModal(true)}
                >
                  Attending
                </Button>
              ) : (
                <Button
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  className="bg-[#4C69DD] text-white hover:bg-[#4C69DD]/90 px-3 h-8"
                >
                  {isJoining ? "Joining..." : "Join Event"}
                </Button>
              )}

              </div>
            </div>
          </CardContent>
        </div>
      </div>
      {showLeaveModal && (
  <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-semibold text-center mb-4 text-primary dark:text-text-secondary">Leave Event?</h3>
      <p className="text-sm text-text text-center mb-6">
        Are you sure you want to withdraw your participation from <strong>{event.title}</strong>?
      </p>
      <div className="flex justify-end gap-3">
        <Button className="text-text" variant="outline" onClick={() => setShowLeaveModal(false)}>
          Cancel
        </Button>
        <Button
          onClick={confirmLeaveEvent}
          className="bg-red-600 text-white hover:bg-red-700"
          disabled={isJoining}
        >
          {isJoining ? "Leaving..." : "Yes, Leave"}
        </Button>
      </div>
    </div>
  </div>
)}

    </Card>
    
  )
}
