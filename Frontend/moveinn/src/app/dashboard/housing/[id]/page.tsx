"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Wifi,
  Calendar,
  BedIcon,
  BathIcon,
  SquareIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/booking/booking-form"
import { API_BASE_IMAGE_URL, API_CREATE_REVIEW, API_GET_ACCOMMODATION, API_GET_USER } from "@/utils/endpoints/config"
import { AccommodationData, OwnerData } from "@/types/accommodation"
import Link from "next/link"
import axios from "axios"
import { API_GET_REVIEWS } from "@/utils/endpoints/config"
import { API_GET_RESERVATIONS_BY_USER } from "@/utils/endpoints/config"
import { useAuth } from "@/context/authcontext"

interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
  user: {
    name: string
    lastName: string
    avatarUrl: string
  }
  reservation: {
    startDate: string
    endDate: string
  }
}

interface Reservation {
  id: string
  userId: string
  accommodationId: string
  startDate: string
  endDate: string
  status: number
  totalPrice: number
}

const typeMap: Record<number, { label: string; badgeColor: string; bgColor: string }> = {
  0: { label: "Room", badgeColor: "bg-pink-200 text-pink-900", bgColor: "from-pink-100 dark:from-[#ffbfea]/50 to-foreground" },
  1: { label: "House", badgeColor: "bg-yellow-200 text-yellow-900", bgColor: "from-yellow-100 dark:from-yellow-200/50 to-foreground" },
  2: { label: "Apartment", badgeColor: "bg-primary text-white", bgColor: "from-primary/30 to-foreground" },
  3: { label: "Rural", badgeColor: "bg-secondary-greenblue text-green-900", bgColor: "from-green-100 dark:from-secondary-greenblue/30 to-foreground" },
  4: { label: "Other", badgeColor: "bg-gray-300 text-gray-800", bgColor: "from-gray-200 dark:from-gray-400 to-foreground" },
}

const typeMapBorder: Record<number, { label: string; borderColor: string;}> = {
  0: { label: "Room", borderColor: "border-pink-500" },
  1: { label: "House", borderColor: "border-yellow-500" },
  2: { label: "Apartment", borderColor: "border-primary" },
  3: { label: "Rural", borderColor: "border-secondary-greenblue" },
  4: { label: "Other", borderColor: "border-gray-500" },
}

export default function AccommodationDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [accommodation, setAccommodation] = useState<AccommodationData | null>(null)
  const [owner, setOwner] = useState<OwnerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  const { user } = useAuth()

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [hasReservationHere, setHasReservationHere] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    title: "",
    content: "",
    rating: 1,
    reservationId: "", // luego lo elegiremos
  })


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!user?.id) return
        const token = localStorage.getItem("token")
        const res = await axios.get(API_GET_RESERVATIONS_BY_USER(user.id), {
          headers: { Authorization: `Bearer ${token}` }
        })
        const allReservations: Reservation[] = res.data
        console.log("All reservations:", allReservations)
        setReservations(allReservations)

        const match = allReservations.some(r => r.accommodationId === id)
        setHasReservationHere(match)
      } catch (err) {
        console.error("Error fetching reservations", err)
      }
    }
  
    fetchReservations()
  }, [user?.id, id])

  useEffect(() => {
    const matchingReservations = reservations.filter(r => r.accommodationId === id)
    if (matchingReservations.length === 1) {
      setReviewForm(prev => ({
        ...prev,
        reservationId: matchingReservations[0].id
      }))
    }
  }, [reservations, id])
  
  

  useEffect(() => {
    const fetchAccommodationData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_GET_ACCOMMODATION(id))
        if (!response.ok) throw new Error("Failed to fetch accommodation data")
        const data = await response.json()
        setAccommodation(data)

        if (data.ownerId) {
          const ownerResponse = await fetch(API_GET_USER(data.ownerId))
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json()
            setOwner(ownerData)
          }
        }
      } catch (err) {
        console.error("Error fetching accommodation:", err)
        setError("Failed to load accommodation details.")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await axios.get(API_GET_REVIEWS(id))
        const data = Array.isArray(res.data) ? res.data : []
        setReviews(data)
      } catch (err) {
        console.error("Error fetching reviews", err)
      }
    }
    
    fetchReviews()
    fetchAccommodationData()
  }, [id])

  const handlePrevImage = () => {
    if (!accommodation?.accomodationImages?.length) return
    setCurrentImageIndex((i) => (i === 0 ? accommodation.accomodationImages.length - 1 : i - 1))
  }

  const handleNextImage = () => {
    if (!accommodation?.accomodationImages?.length) return
    setCurrentImageIndex((i) => (i === accommodation.accomodationImages.length - 1 ? 0 : i + 1))
  }

  const handleBookNow = () => setIsBookingModalOpen(true)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !accommodation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h3 className="text-xl font-semibold mb-2 text-text">Error</h3>
        <p className="text-text-secondary mb-4">{error || "Accommodation not found"}</p>
        <Button onClick={() => router.push("/dashboard")} className="bg-primary text-foreground">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const type = typeMap[accommodation.acommodationType] ?? typeMap[4]
  const userReservationsForThisAccommodation = reservations.filter(
    (r) => r.accommodationId === id && r.status === 3
  )

  const completedReservations = reservations.filter(
    (r) => r.accommodationId === id && r.status === 3
  )
  const canSubmitReview = completedReservations.length > 0
  const hasUserAlreadyReviewed = Array.isArray(reviews) && reviews.some(r => r.user.name === user?.name && r.user.lastName === user?.lastName)

  const imageUrl = accommodation.accomodationImages?.[currentImageIndex]?.url
    ? `${API_BASE_IMAGE_URL}${accommodation.accomodationImages[currentImageIndex].url}`
    : "/placeholder.svg"

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Header with badge and background */}
      <Link href="/dashboard/housing" className="text-sm text-primary dark:text-text-secondary hover:underline flex items-center mb-2">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Housing
      </Link>

      <div className={`rounded-t-lg bg-gradient-to-br border-b-3 ${typeMapBorder[accommodation.acommodationType].borderColor} ${type.bgColor} px-4 py-3`}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-text dark:text-text">{accommodation.title}</h1>
          <Badge className={`text-xs font-semibold px-2 py-1 ${type.badgeColor}`}>
            {type.label}
          </Badge>
        </div>
        <div className="flex items-center text-text-secondary dark:text-gray-300 mb-2 bg-background/50 w-fit rounded-full px-2 py-1">
          <MapPin className="h-4 w-4 mr-1 text-primary" />
          <span>{accommodation.city}, {accommodation.country}</span>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative overflow-hidden h-80 w-full mb-6 rounded-b-lg">
        <Image
          src={imageUrl}
          alt={accommodation.title}
          fill
          unoptimized
          className="object-cover"
        />
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-foreground rounded-full p-2 shadow hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5 text-text" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground rounded-full p-2 shadow hover:bg-background"
        >
          <ChevronRight className="h-5 w-5 text-text" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="md:col-span-2">
          <p className="text-text mb-6">{accommodation.description}</p>

          <div className="bg-background rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-text">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {accommodation.hasWifi && (
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-primary mr-2" />
                  <span className="text-text-secondary">High-speed WiFi</span>
                </div>
              )}
              <div className="flex items-center">
                <BedIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-text-secondary">{accommodation.numberOfRooms} bedroom(s)</span>
              </div>
              <div className="flex items-center">
                <BathIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-text-secondary">{accommodation.bathrooms} bathroom(s)</span>
              </div>
              <div className="flex items-center">
                <SquareIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-text-secondary">{accommodation.squareMeters} m²</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-text">Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <span className="text-text-secondary text-sm">Available from</span>
                </div>
                <p className="text-text font-medium">{formatDate(accommodation.availableFrom)}</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <span className="text-text-secondary text-sm">Available to</span>
                </div>
                <p className="text-text font-medium">{formatDate(accommodation.availableTo)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div className="md:col-span-1">
          <div className="bg-foreground rounded-lg shadow-lg p-6 border border-background sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-primary-dark">€{accommodation.pricePerMonth}</span>
              <span className="text-text-secondary">/month</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Deposit</span>
                <span className="font-medium text-text">€{accommodation.pricePerMonth}</span>
              </div>
              <div className="pt-3 border-t border-background flex justify-between font-semibold">
                <span className="text-text">Total (1st month)</span>
                <span className="text-primary-dark">€{accommodation.pricePerMonth * 2}</span>
              </div>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent-dark text-foreground font-medium py-3"
              onClick={handleBookNow}
            >
              Book Now
            </Button>

            {owner && (
              <div className="mt-6 pt-4 border-t border-background flex items-center gap-3">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-lg font-bold text-primary">
                  {owner.name.charAt(0)}
                </div>
                <p className="text-text font-medium">{owner.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {accommodation && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          accommodation={accommodation}
        />
      )}

{reviews.length > 0 && (
  <div className="mt-10 bg-background rounded-xl border border-border dark:border-gray-800 p-6">
    <h3 className="text-xl font-bold mb-4 text-text">Reviews</h3>
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-foreground border border-border dark:border-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-bold text-primary">
                {review.user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-text">{review.user.name} {review.user.lastName}</p>
                <p className="text-xs text-text-secondary">
                  {new Date(review.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
              ))}
            </div>
          </div>
          <p className="font-semibold text-text">{review.title}</p>
          <p className="text-sm text-text-secondary mt-1">{review.content}</p>
          <p className="text-xs text-muted mt-2">
            Stay: {new Date(review.reservation.startDate).toLocaleDateString("es-ES")} – {new Date(review.reservation.endDate).toLocaleDateString("es-ES")}
          </p>
        </div>
      ))}
    </div>
    
    {hasReservationHere && (
  <div className="mt-6">
    {hasUserAlreadyReviewed ? (
      <p className="text-sm text-green-700 bg-green-100 px-4 py-2 rounded-md border border-green-300 w-fit">
        Thanks for your feedback!
      </p>
    ) : !showReviewForm ? (
      <Button
        className="bg-primary hover:bg-primary/90 text-white"
        onClick={() => setShowReviewForm(true)}
      >
        Write a Review
      </Button>
    ) : (
      <>
        {canSubmitReview ? (
          <div className="space-y-4 bg-foreground p-6 mt-4 rounded-lg border border-border dark:border-gray-800">
            <div>
              <label className="text-sm font-medium text-text">Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-text-secondary text-sm text-text"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text">Content</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-text-secondary text-sm text-text"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text">Rating (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="w-20 mt-1 ml-2 p-2 rounded-md border border-gray-300 dark:border-text-secondary text-sm text-text"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text">Select Reservation</label>
              <select
                value={reviewForm.reservationId}
                onChange={(e) => setReviewForm({ ...reviewForm, reservationId: e.target.value })}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-text-secondary text-sm text-text"
              >
                <option value="">Choose one</option>
                {userReservationsForThisAccommodation.map((r) => (
                  <option key={r.id} value={r.id}>
                    {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-primary hover:bg-accent text-white"
                onClick={async () => {
                  const token = localStorage.getItem("token")
                  try {
                    await axios.post(API_CREATE_REVIEW, {
                      title: reviewForm.title.trim(),
                      content: reviewForm.content.trim(),
                      rating: reviewForm.rating,
                      reservationId: reviewForm.reservationId,
                      userId: user?.id,
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    })

                    setShowReviewForm(false)
                    setReviewForm({ title: "", content: "", rating: 1, reservationId: "" })

                    const res = await axios.get(API_GET_REVIEWS(id))
                    setReviews(res.data)
                  } catch (err) {
                    console.error("Error submitting review", err)
                  }
                }}
              >
                Submit Review
              </Button>

              <Button
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  setShowReviewForm(false)
                  setReviewForm({ title: "", content: "", rating: 1, reservationId: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 mt-4 rounded-md text-sm">
            You’ll be able to submit your review once your stay is completed.
          </div>
        )}
      </>
    )}
  </div>
)}



  </div>
)}

    </div>
  )
}
