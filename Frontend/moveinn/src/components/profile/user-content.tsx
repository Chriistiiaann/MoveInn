"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import {
  API_REVIEWS_USER,
  API_RESERVATIONS_USER,
  API_RECOMMENDATIONS_USER,
  API_ACCOMMODATIONS_USER,
  API_EVENTS_USER,
  API_FORUMS_USER,
} from "@/utils/endpoints/config"
import { CalendarOff, MapPinOff, Bookmark, Sofa, MessageCircleOff, NotebookPen } from "lucide-react"
import { useAuth } from "@/context/authcontext"
import { format } from "date-fns"
import ForumCard from "@/components/forums/forum-card"
import EventCardWrapper from "@/components/events/event-card-wrapper"
import { AcommodationCard } from "@/components/housing/acommodation-card"
import { DetailedRecommendationCard } from "@/components/recommendations/detailed-recommendation-card"
import { getCategoryIcon } from "@/app/dashboard/recommendations/page"
import { ReservationCard } from "@/components/reservations/reservation-card"
import { ReviewCard } from "@/components/reviews/review-card"


export function UserContentOverview() {
  const { user } = useAuth()
  const [data, setData] = useState({
    reviews: [],
    reservations: [],
    recommendations: [],
    accommodations: [],
    events: [],
    forums: [],
  })

  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_REVIEWS_USER(user?.id))
      console.log("REVIEWS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching reviews", err)
      return []
    }
  }

  const fetchReservations = async () => {
    try {
      const res = await axios.get(API_RESERVATIONS_USER(user?.id))
      console.log("RESERVATIONS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching reservations", err)
      return []
    }
  }

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(API_RECOMMENDATIONS_USER(user?.id))
      console.log("RECOMMENDATIONS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching recommendations", err)
      return []
    }
  }

  const fetchAccommodations = async () => {
    try {
      const res = await axios.get(API_ACCOMMODATIONS_USER(user?.id))
      console.log("ACCOMMODATIONS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching accommodations", err)
      return []
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS_USER(user?.id))
      console.log("EVENTS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching events", err)
      return []
    }
  }

  const fetchForums = async () => {
    try {
      const res = await axios.get(API_FORUMS_USER(user?.id))
      console.log("FORUMS:", res.data)
      return res.data
    } catch (err) {
      console.error("Error fetching forums", err)
      return []
    }
  }

  useEffect(() => {
    if (!user) return

    const fetchAllData = async () => {
      const [reviews, reservations, recommendations, accommodations, events, forums] = await Promise.all([
        fetchReviews(),
        fetchReservations(),
        fetchRecommendations(),
        fetchAccommodations(),
        fetchEvents(),
        fetchForums(),
      ])
      setData({ reviews, reservations, recommendations, accommodations, events, forums })
    }

    fetchAllData()
  }, [user])

  const formatDate = (d: string) => format(new Date(d), "PPP")

  const renderCards = (items: any[], type: string) => {
    if (items.length === 0) {
      return <p className="text-sm text-muted-foreground">No {type} found.</p>
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item: any) => (
          <Card key={item.id} className="bg-foreground border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-primary">
                {item.title || item.name || `Item #${item.id}`}
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-text">
              {type === "reviews" && (
                <>
                  <p><span className="font-medium">Rating:</span> {item.rating}</p>
                  <p><span className="font-medium">Content:</span> {item.content}</p>
                </>
              )}
              {type === "reservations" && (
                <>
                  <p><span className="font-medium">Accommodation ID:</span> {item.accommodationId}</p>
                  <p><span className="font-medium">From:</span> {formatDate(item.startDate)}</p>
                  <p><span className="font-medium">To:</span> {formatDate(item.endDate)}</p>
                  <p><span className="font-medium">Status:</span> {item.status}</p>
                  <p><span className="font-medium">Total:</span> €{item.totalPrice}</p>
                </>
              )}
              {type === "recommendations" && (
                <>
                  <p>{item.description}</p>
                  <p className="text-xs text-muted-foreground">Category: {item.category} | Rating: {item.rating}</p>
                </>
              )}
              {type === "accommodations" && (
                <>
                  <p><span className="font-medium">Location:</span> {item.address}, {item.city}</p>
                  <p><span className="font-medium">Rooms:</span> {item.numberOfRooms}, Baths: {item.bathrooms}</p>
                  <p><span className="font-medium">From:</span> {formatDate(item.availableFrom)}</p>
                </>
              )}
              {type === "events" && (
                <>
                  <p><span className="font-medium">Location:</span> {item.location}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(item.date)}</p>
                  <p className="text-xs">{item.description}</p>
                </>
              )}
              {type === "forums" && (
                <>
                  <p>{item.description}</p>
                  <p className="text-xs text-muted-foreground">Country: {item.country}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <section className="w-full  px-4 md:px-0 max-w-6xl mx-auto mt-6 overflow-x-visible">

      <Tabs defaultValue="reviews" className="space-y-4">
      <div className="w-full flex justify-center">
      <TabsList className="flex flex-wrap md:flex-nowrap md:justify-center overflow-x-auto gap-2 p-1 bg-foreground rounded-lg">

          <TabsTrigger value="reviews" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Reviews</TabsTrigger>
          <TabsTrigger value="reservations" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Reservations</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Recommendations</TabsTrigger>
          <TabsTrigger value="accommodations" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Accommodations</TabsTrigger>
          <TabsTrigger value="events" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Events</TabsTrigger>
          <TabsTrigger value="forums" className="text-text min-w-[130px] text-sm text-text whitespace-nowrap">Forums</TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="reviews">
            <div className="grid gap-4 md:grid-cols-2">
                {data.reviews.length > 0 ? (
                data.reviews.map((rev: any) => (
                    <ReviewCard key={rev.id} review={rev} />
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                        <MessageCircleOff className="h-12 w-12 text-primary" />
                        <p className="text-md text-text">No reviews found.</p>
                    </div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="reservations">
            <div className="grid gap-4 md:grid-cols-2">
                {data.reservations.length > 0 ? (
                data.reservations.map((res: any) => (
                    <ReservationCard key={res.id} reservation={res} />
                ))
                ) : (
                    <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center gap-2 col-span-full">
                        <NotebookPen className="h-12 w-12 text-primary" />
                        <p className="text-md text-text">No reservations found.</p>
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
                data.accommodations.map((accom: any) => (
                    <AcommodationCard key={accom.id} acommodation={accom} />
                ))
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
                data.events.map((event: any) => (
                    <EventCardWrapper key={event.id} event={event} />
                ))
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
