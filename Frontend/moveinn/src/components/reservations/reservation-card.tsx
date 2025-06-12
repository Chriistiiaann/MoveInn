"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, BadgeEuro, BedDouble, CalendarX2 } from "lucide-react"
import { format } from "date-fns"

interface Props {
  reservation: {
    id: string
    accommodationId: string
    startDate: string
    endDate: string
    status: number
    totalPrice: number
  }
}

const statusMap: Record<number, string> = {
  0: "pending",
  1: "confirmed",
  2: "cancelled",
  3: "completed",
}

const getStatusColor = (status: number) => {
  const statusStr = statusMap[status] ?? "unknown"

  switch (statusStr) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-green-200 text-green-900"
    case "cancelled":
      return "bg-red-200 text-red-900"
    case "completed":
      return "bg-blue-200 text-blue-900"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

export function ReservationCard({ reservation }: Props) {
  const formattedStart = format(new Date(reservation.startDate), "PPP")
  const formattedEnd = format(new Date(reservation.endDate), "PPP")

  return (
    <Card className="flex flex-col justify-between h-full shadow-md bg-foreground border-none">
      <CardHeader>
        <CardTitle className="text-text text-lg">Reservation <span className="text-primary dark:text-text-secondary">#{reservation.id.slice(0, 8)}</span></CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-text">
        <div className="flex items-center gap-2 text-sm">
          <CalendarCheck className="h-4 w-4 text-primary dark:text-text-secondary" />
          <span><strong>From:</strong> {formattedStart}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarX2 className="h-4 w-4 text-primary dark:text-text-secondary" />
          <span><strong>To:</strong> {formattedEnd}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BedDouble className="h-4 w-4 text-primary dark:text-text-secondary" />
          <span><strong>Accommodation ID:</strong> {reservation.accommodationId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BadgeEuro className="h-4 w-4 text-primary dark:text-text-secondary" />
          <span><strong>Total:</strong> €{reservation.totalPrice}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 pb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(reservation.status)}`}
        >
          {statusMap[reservation.status] ?? "Unknown"}
        </span>
      </CardFooter>
    </Card>
  )
}
