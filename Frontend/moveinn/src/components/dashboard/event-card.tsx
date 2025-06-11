import { CalendarIcon, MapPinIcon, Users2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/context/authcontext"
import { API_JOIN_EVENT, API_LEAVE_EVENT } from "@/utils/endpoints/config"
import { format, parseISO } from "date-fns"

interface EventCardProps {
  eventId: string
  title: string
  date: string
  location: string
  attendeesCount: number
  category: string
  joined: boolean
  onStatusChange?: (joined: boolean) => void
}

export function EventCard({
  eventId,
  title,
  date,
  location,
  attendeesCount,
  category,
  joined,
  onStatusChange
}: EventCardProps) {
  const { user } = useAuth()
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(joined)
  const [currentAttendees, setCurrentAttendees] = useState(attendeesCount)

  useEffect(() => {
    setIsJoined(joined)
    setCurrentAttendees(attendeesCount)
  }, [joined, attendeesCount])

  const handleJoinLeave = async () => {
    if (!user?.id) return
    setIsJoining(true)

    try {
      if (isJoined) {
        await axios.post(API_LEAVE_EVENT(eventId, user.id))
        setIsJoined(false)
        setCurrentAttendees(prev => Math.max(prev - 1, 0))
        onStatusChange?.(false)
      } else {
        await axios.post(API_JOIN_EVENT(eventId, user.id))
        setIsJoined(true)
        setCurrentAttendees(prev => prev + 1)
        onStatusChange?.(true)
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case "social": return "from-pink-100 to-foreground dark:from-[#ffbfea]/50"
      case "trip": return "from-[#4C69DD]/20 to-foreground"
      case "cultural": return "from-[#62C3BA]/30 to-foreground"
      case "academic": return "from-amber-200 to-foreground dark:from-[#723917]/50"
      case "sports": return "from-purple-100 to-foreground dark:from-[#ccb1ef]/50"
      case "workshop": return "from-yellow-100 to-foreground dark:from-yellow-200/50"
      case "party": return "from-[#0E1E40]/30 to-foreground dark:from-[#0E1E40]/50"
      case "food": return "from-green-100 to-foreground dark:from-green-200/50"
      case "other": return "from-gray-200 to-foreground dark:from-gray-400/20"
      default: return "from-gray-100 to-foreground"
    }
  }

  const getBadgeColor = () => {
    switch (category.toLowerCase()) {
      case "social": return "bg-pink-200 text-pink-900"
      case "trip": return "bg-primary text-white"
      case "cultural": return "bg-secondary-greenblue text-green-900"
      case "academic": return "bg-amber-400 text-amber-900"
      case "sports": return "bg-purple-200 text-purple-900"
      case "workshop": return "bg-yellow-200 text-yellow-900"
      case "party": return "bg-[#0E1E40] text-white"
      case "food": return "bg-green-200 text-green-900"
      case "other": return "bg-gray-300 text-gray-800"
      default: return "bg-gray-200 text-gray-700"
    }
  }

  const getCategoryColorBorder = () => {
    switch (category.toLowerCase()) {
      case "social": return "border-pink-500"
      case "trip": return "border-primary"
      case "cultural": return "border-secondary-greenblue"
      case "academic": return "border-amber-400"
      case "sports": return "border-purple-500"
      case "workshop": return "border-yellow-500"
      case "party": return "border-[#0E1E40]"
      case "food": return "border-green-500"
      case "other": return "border-gray-500"
      default: return "border-gray-500"
    }
  }

  const truncate = (text: string, maxLength = 28) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r ${getCategoryColor()} hover:shadow-md transition-all min-h-[110px] border-l-3 ${getCategoryColorBorder()} hover:border-background/50`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getBadgeColor()}`}>
        <CalendarIcon className="h-6 w-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
          <h3 className="font-medium text-text truncate max-w-[200px]">{title}</h3>
          <Badge className={isJoined ? "bg-secondary text-[#0E1E40]" : getBadgeColor()}>
            {isJoined ? "Joined" : category}
          </Badge>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap text-sm text-gray-800 dark:text-text-secondary gap-y-1 gap-x-4">
          <div className="flex text-xs items-center bg-background/20 dark:bg-background/50 px-2 py-1 rounded-full w-fit">
            <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <span className="truncate text-gray-600 dark:text-gray-300">{format(parseISO(date), "EEEE, MMMM d, h:mm a")}</span>
          </div>
          <div className="flex text-xs items-center bg-background/20 dark:bg-background/50 px-2 py-1 rounded-full w-fit">
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <span className="truncate text-gray-600 dark:text-gray-300">{truncate(location)}</span>
          </div>
          <div className="flex text-xs items-center bg-background/20 dark:bg-background/50 px-2 py-1 rounded-full w-fit">
            <Users2Icon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <span className="text-gray-600 dark:text-gray-300">{currentAttendees}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleJoinLeave}
        disabled={isJoining}
        variant={isJoined ? "ghost" : "default"}
        size="sm"
        className={
          isJoined
            ? "border-[#4C69DD] text-[#4C69DD] dark:text-text-secondary hover:bg-primary/10"
            : "bg-[#4C69DD] hover:bg-[#4C69DD]/90 text-white"
        }
      >
        {isJoining ? "Loading..." : isJoined ? "Leave Event" : "Join Event"}
      </Button>
    </div>
  )
}
