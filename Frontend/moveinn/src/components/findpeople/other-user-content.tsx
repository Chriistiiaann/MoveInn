"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  CalendarOff,
  MapPinOff,
  Bookmark,
  Sofa,
  MessageCircleOff,
  NotebookPen,
} from "lucide-react"
import { format } from "date-fns"

import {
  API_REVIEWS_USER,
  API_RECOMMENDATIONS_USER,
  API_ACCOMMODATIONS_USER,
  API_EVENTS_USER,
  API_FORUMS_USER,
} from "@/utils/endpoints/config"

import ForumCard from "@/components/forums/forum-card"
import EventCardWrapper from "@/components/events/event-card-wrapper"
import { AcommodationCard } from "@/components/housing/acommodation-card"
import { DetailedRecommendationCard } from "@/components/recommendations/detailed-recommendation-card"
import { getCategoryIcon } from "@/app/dashboard/recommendations/page"
import { ReviewCard } from "@/components/reviews/review-card"

export function OtherUserContentOverview({ userId }: { userId: string }) {
  const [data, setData] = useState({
    reviews: [],
    recommendations: [],
    accommodations: [],
    events: [],
    forums: [],
  })

  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_REVIEWS_USER(userId))
      return res.data
    } catch (err) {
      console.error("Error fetching reviews", err)
      return []
    }
  }

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(API_RECOMMENDATIONS_USER(userId))
      return res.data
    } catch (err) {
      console.error("Error fetching recommendations", err)
      return []
    }
  }

  const fetchAccommodations = async () => {
    try {
      const res = await axios.get(API_ACCOMMODATIONS_USER(userId))
      return res.data
    } catch (err) {
      console.error("Error fetching accommodations", err)
      return []
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS_USER(userId))
      return res.data
    } catch (err) {
      console.error("Error fetching events", err)
      return []
    }
  }

  const fetchForums = async () => {
    try {
      const res = await axios.get(API_FORUMS_USER(userId))
      return res.data
    } catch (err) {
      console.error("Error fetching forums", err)
      return []
    }
  }

  useEffect(() => {
    if (!userId) return

    const fetchAllData = async () => {
      const [reviews, recommendations, accommodations, events, forums] = await Promise.all([
        fetchReviews(),
        fetchRecommendations(),
        fetchAccommodations(),
        fetchEvents(),
        fetchForums(),
      ])
      setData({ reviews, recommendations, accommodations, events, forums })
    }

    fetchAllData()
  }, [userId])

  const formatDate = (d: string) => format(new Date(d), "PPP")

  return (
    <section className="w-full px-4 md:px-0 max-w-6xl mx-auto mt-6 overflow-x-visible">
      <Tabs defaultValue="reviews" className="space-y-4">
        <div className="w-full flex justify-center">
          <TabsList className="flex flex-wrap md:flex-nowrap md:justify-center overflow-x-auto gap-2 p-1 bg-foreground rounded-lg">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reviews">
          <div className="grid gap-4 md:grid-cols-2">
            {data.reviews.length > 0 ? (
              data.reviews.map((rev: any) => <ReviewCard key={rev.id} review={rev} />)
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                <MessageCircleOff className="h-12 w-12 text-primary" />
                <p className="text-md text-text">No reviews found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid gap-4 md:grid-cols-2">
            {data.recommendations.length > 0 ? (
              data.recommendations.map((rec: any) => (
                <DetailedRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  categoryIcon={getCategoryIcon(rec.category)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                <MapPinOff className="h-12 w-12 text-primary" />
                <p className="text-md text-text">No recommendations found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accommodations">
          <div className="grid gap-4 md:grid-cols-2">
            {data.accommodations.length > 0 ? (
              data.accommodations.map((accom: any) => <AcommodationCard key={accom.id} acommodation={accom} />)
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                <Sofa className="h-12 w-12 text-primary" />
                <p className="text-md text-text">No accommodations found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-4">
            {data.events.length > 0 ? (
              data.events.map((event: any) => <EventCardWrapper key={event.id} event={event} />)
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                <CalendarOff className="h-12 w-12 text-primary" />
                <p className="text-md text-text">No events found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="forums">
          <div className="grid gap-4 md:grid-cols-2">
            {data.forums.length > 0 ? (
              data.forums.map((forum: any) => <ForumCard key={forum.id} forum={forum} />)
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                <Bookmark className="h-12 w-12 text-primary" />
                <p className="text-md text-text">No forums found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
