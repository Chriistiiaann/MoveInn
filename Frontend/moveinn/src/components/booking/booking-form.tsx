"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authcontext"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Calendar, Home, CreditCard } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { API_BASE_URL, API_CREATE_RESERVATION } from "@/utils/endpoints/config"
import axios from "axios"
import { BookingModalProps } from "@/types/accommodation"

export function BookingModal({ isOpen, onClose, accommodation }: BookingModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([])

  const minDate = new Date(accommodation.availableFrom)
  const maxDate = new Date(accommodation.availableTo)

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Accommodations/UnavailableDates/${accommodation.id}`)
        const data = await res.json()
        setUnavailableDates(data.map((d: string) => new Date(d)))
      } catch (err) {
        console.error("Error fetching unavailable dates:", err)
      }
    }
    fetchUnavailableDates()
  }, [accommodation.id])

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0
    const months = Math.max(1, endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()))
    return accommodation.pricePerMonth * months + accommodation.pricePerMonth
  }

  const totalDue = calculateTotal()

  const handleCreateReservation = async () => {
    if (!user || !startDate || !endDate) {
      setError("Please log in and select the dates")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.post(API_CREATE_RESERVATION, {
        userId: user.id,
        accommodationId: accommodation.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "Pending",
        totalPrice: totalDue,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        }
      })

      router.push(`/reservations/${response.data.id}`)
    } catch (error) {
      console.error("Error creating reservation:", error)
      setError("Failed to create reservation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 rounded-xl shadow-md border-none"
      >
        <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] p-6 text-white">
          <DialogTitle className="text-xl font-bold text-center text-white">Book Accommodation</DialogTitle>
          <p className="text-center text-sm mt-1 text-white/80">Select your check-in and check-out dates</p>
        </div>

        <div className="p-6 bg-foreground">
          <div className="flex items-center mb-5">
            <Home className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold text-text">{accommodation.title}</h3>
          </div>

          <div className="space-y-5 mb-6">
            {[{ label: "Check-in date", value: startDate, setValue: setStartDate, min: minDate },
              { label: "Check-out date", value: endDate, setValue: setEndDate, min: startDate || minDate }]
              .map(({ label, value, setValue, min }, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-primary" /> {label}
                </label>
                <DatePicker
                  selected={value}
                  onChange={(date) => setValue(date)}
                  minDate={min}
                  maxDate={maxDate}
                  excludeDates={unavailableDates}
                  placeholderText={`Select ${label.toLowerCase()}`}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-primary/30 px-4 py-2.5 rounded-md bg-background text-text focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="bg-background p-5 rounded-lg border border-border mb-5">
            <h4 className="font-medium text-text mb-4 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-primary" /> Price Summary
            </h4>
            {startDate && endDate ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rent</span>
                  <span className="text-text font-medium">€{accommodation.pricePerMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Security Deposit</span>
                  <span className="text-text font-medium">€{accommodation.pricePerMonth}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-text">Total</span>
                  <span className="font-bold text-lg text-primary-dark">€{totalDue}</span>
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-sm italic">Select dates to calculate total</p>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50 p-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="sm:flex-1 border-primary text-text hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReservation}
              disabled={isSubmitting || !startDate || !endDate}
              className="sm:flex-1 bg-[#4C69DD] hover:bg-[#3b5ccd] text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
