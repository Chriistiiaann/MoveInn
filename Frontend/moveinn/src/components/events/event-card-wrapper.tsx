"use client"

import { DetailedEventCard } from "@/components/events/detailed-event-card"
import { PartyPopper, BookOpen, Globe, Users, Star, Flag } from "lucide-react"

export default function EventCardWrapper({ event }: { event: any }) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "party": return <PartyPopper className="w-4 h-4" />
      case "academic": return <BookOpen className="w-4 h-4" />
      case "cultural": return <Globe className="w-4 h-4" />
      case "social": return <Users className="w-4 h-4" />
      case "sports": return <Star className="w-4 h-4" />
      case "trip": return <Flag className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return <DetailedEventCard event={{
    ...event,
    date: new Date(event.date)
  }} categoryIcon={getCategoryIcon(event.category)} />
}
