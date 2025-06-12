"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/authcontext"
import { Calendar, MapPin, Users, Home, Wifi, Square, CheckCircle, Clock, User, Mail, Key, PhoneCall } from "lucide-react"
import Image from "next/image"
import { API_BASE_IMAGE_URL, API_GET_ACCOMMODATION, API_GET_RESERVATION } from "@/utils/endpoints/config"
import { getCookie } from "cookies-next"

interface AccommodationData {
  id: string
  title: string
  description: string
  address: string
  city: string
  country: string
  pricePerMonth: number
  numberOfRooms: number
  bathrooms: number
  squareMeters: number
  hasWifi: boolean
  availableFrom: string
  availableTo: string
  ownerId: string
  accomodationImages: {
    id: string
    url: string
    createdAt: string
    accommodationId: string
  }[]
}
interface ReservationData {
  id: string
  accommodationId: string
  userId: string
  startDate: string
  endDate: string
  status: number
  createdAt: string
  updatedAt: string
  totalPrice: number
}

const getStatusDetails = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Pending", color: "bg-yellow-400" }
    case 1:
      return { label: "Confirmed", color: "bg-green-500" }
    case 2:
      return { label: "Cancelled", color: "bg-red-500" }
    case 3:
      return { label: "Completed", color: "bg-blue-500" }
    default:
      return { label: "Unknown", color: "bg-gray-400" }
  }
}

export function Reservation() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [accommodation, setAccommodation] = useState<AccommodationData | null>(null);
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingReservation, setConfirmingReservation] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchReservationAndAccommodation();
    }
  }, [id, isLoading, isAuthenticated, router]);

  const fetchReservationAndAccommodation = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const resReservation = await fetch(API_GET_RESERVATION(id as string), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resReservation.ok) {
        if (resReservation.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized access");
        }
        throw new Error("Failed to fetch reservation data");
      }

      const reservationData = await resReservation.json();
      setReservation(reservationData);

      const accommodationId = reservationData.accommodationId;
      if (!accommodationId) {
        throw new Error("Accommodation ID is missing in the reservation data");
      }

      const resAccommodation = await fetch(API_GET_ACCOMMODATION(accommodationId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resAccommodation.ok) {
        if (resAccommodation.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized access");
        }
        throw new Error("Failed to fetch accommodation data");
      }

      const accommodationData = await resAccommodation.json();
      console.log(accommodationData)
      console.log(`${API_BASE_IMAGE_URL}${accommodationData.accomodationImages[0].url}`)
      setAccommodation(accommodationData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load data. Please try again later."
      );
      if (error instanceof Error && error.message === "Unauthorized access") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setConfirmingReservation(true);
    router.push(`/payment/${id}`);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">Accommodation not found</h3>
        <p className="text-gray-500 mb-4">
          The accommodation you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const availableFrom = formatDate(accommodation.availableFrom);
  const availableTo = formatDate(accommodation.availableTo);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Confirm Your Reservation</h1>
        <p className="text-blue-100">Review the details below and confirm your accommodation reservation</p>
      </div>

      <div className="bg-white rounded-b-xl shadow-xl overflow-hidden">
        <div className="relative h-64 w-full">
        {accommodation.accomodationImages.length > 0 ? (
  <Image
    src={`${API_BASE_IMAGE_URL}${accommodation.accomodationImages[0].url}`}
    alt={accommodation.title}
    fill
    className="object-cover"
    unoptimized
  />
) : (
  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
    No image available
  </div>
)}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{accommodation.title}</h2>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {accommodation.address}, {accommodation.city}, {accommodation.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-blue-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Accommodation Details</h3>
              <p className="text-gray-700 mb-4">{accommodation.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Rooms</p>
                    <p className="font-medium text-gray-800">{accommodation.numberOfRooms} bedroom(s)</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium text-gray-800">{accommodation.bathrooms} bathroom(s)</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Square className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium text-gray-800">{accommodation.squareMeters} m²</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">WiFi</p>
                    <p className="font-medium text-gray-800">{accommodation.hasWifi ? "Available" : "Not available"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">Reservation Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Available From</p>
                    <p className="font-medium text-gray-800">{availableFrom}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Available To</p>
                    <p className="font-medium text-gray-800">{availableTo}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          getStatusDetails(reservation?.status || 0).color
                        }`}
                      ></span>
                      <span className="font-medium text-gray-800">
                        {getStatusDetails(reservation?.status || 0).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Key className="h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Reservation ID</p>
                    <p className="font-medium text-gray-800 text-xs">{id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Your Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user?.mail}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <PhoneCall className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{user?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly rent</span>
                  <span className="font-medium text-blue-600">{accommodation.pricePerMonth}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security deposit</span>
                  <span className="font-medium text-blue-600">{accommodation.pricePerMonth}€</span>
                </div>
                <div className="border-t border-gray-200+ pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total due now</span>
                  <span className="font-bold text-blue-600">
                    {(reservation?.totalPrice ?? 0) + accommodation.pricePerMonth}€
                    
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {reservation?.status === 0 && (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={confirmingReservation}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {confirmingReservation ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By confirming, you agree to MoveInn's{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Cancellation Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}