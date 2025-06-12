"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MessageCircle, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
  userId: string
  reservationId: string
}

export function ReviewCard({ review }: { review: Review }) {
  const formattedDate = format(new Date(review.createdAt), "PPP")

  return (
    <Card className="flex flex-col justify-between h-full shadow-md bg-foreground border-none">
      <CardHeader>
        <CardTitle className="text-primary dark:text-text-secondary text-lg truncate">{review.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-text">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span><strong>Rating:</strong> {review.rating} / 5</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MessageCircle className="h-4 w-4 text-primary dark:text-text-secondary mt-1" />
          <p className="text-sm text-text">{review.content}</p>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 text-xs text-muted-foreground flex justify-between">
        <span className="flex items-center gap-1 text-text">
          <Calendar className="h-3.5 w-3.5 text-primary dark:text-text-secondary" />
          {formattedDate}
        </span>
        <span className="text-right">User: <span className="text-text font-medium">{review.userId.slice(0, 8)}</span></span>
      </CardFooter>
    </Card>
  )
}
