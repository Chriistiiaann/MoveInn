"use client"

import Link from "next/link"
import { MapPin, BedIcon, BathIcon, Ruler, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { AccommodationData } from "@/types/accommodation"

interface DashboardAcommodationCardProps {
  acommodation: AccommodationData
}

function getTypeStyle(type: number) {
  switch (type) {
    case 0:
      return {
        label: "Room",
        badgeColor: "bg-pink-200 text-pink-900",
        bgColor: "from-pink-100 to-foreground dark:from-[#ffbfea]/50",
      }
    case 1:
      return {
        label: "House",
        badgeColor: "bg-yellow-200 text-yellow-900",
        bgColor: "from-yellow-100 to-foreground dark:from-yellow-200/50",
      }
    case 2:
      return {
        label: "Apartment",
        badgeColor: "bg-primary text-white",
        bgColor: "from-[#4C69DD]/20 to-foreground",
      }
    case 3:
      return {
        label: "Rural",
        badgeColor: "bg-secondary-greenblue text-green-900",
        bgColor: "from-green-100 to-foreground dark:from-secondary-greenblue/30",
      }
    default:
      return {
        label: "Other",
        badgeColor: "bg-gray-300 text-gray-800",
        bgColor: "from-gray-200 to-foreground dark:from-gray-400/20",
      }
  }
}

const typeMapBorder: Record<number, { label: string; borderColor: string;}> = {
  0: { label: "Room", borderColor: "border-pink-500" },
  1: { label: "House", borderColor: "border-yellow-500" },
  2: { label: "Apartment", borderColor: "border-primary" },
  3: { label: "Rural", borderColor: "border-secondary-greenblue" },
  4: { label: "Other", borderColor: "border-gray-500" },
}
export function DashboardAcommodationCard({ acommodation }: DashboardAcommodationCardProps) {
  const { label, badgeColor, bgColor } = getTypeStyle(acommodation.acommodationType)

  return (
    <Link href={`/dashboard/housing/${acommodation.id}`} className="block">
      <Card className={`cursor-pointer flex flex-col gap-2 p-3 rounded-[var(--radius-lg)] shadow-sm bg-gradient-to-br ${bgColor} hover:shadow-md transition-all border-0 border-l-3 ${typeMapBorder[acommodation.acommodationType].borderColor} hover:border-background/50`}>
        {/* Title + Type */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-text line-clamp-1 pr-2">
            {acommodation.title}
          </h3>
          <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-md ${badgeColor}`}>
            {label}
          </span>
        </div>

        {/* Address + Price */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center text-xs bg-background/50 dark:bg-background/50 px-2 py-1 rounded-full w-fit max-w-[70%]">
            <MapPin className="h-3 w-3 mr-1 text-primary" />
            <span className="truncate text-gray-600 dark:text-gray-300">{acommodation.address}</span>
          </div>

          <div className="text-right whitespace-nowrap text-sm font-bold text-primary-dark dark:text-text">
            €{acommodation.pricePerMonth}
            <div className="text-[10px] text-gray-500 dark:text-gray-400">/month</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
          <span className="bg-background/50 text-text px-2 py-0.5 rounded-md flex items-center gap-1">
            {acommodation.numberOfRooms} <BedIcon className="h-3 w-3" />
          </span>
          <span className="bg-background/50 text-text px-2 py-0.5 rounded-md flex items-center gap-1">
            {acommodation.bathrooms} <BathIcon className="h-3 w-3" />
          </span>
          <span className="bg-background/50 text-text px-2 py-0.5 rounded-md flex items-center gap-1">
            {acommodation.squareMeters} m² <Ruler className="h-3 w-3" />
          </span>
          {acommodation.hasWifi && (
            <span className="bg-background/50 text-text px-2 py-0.5 rounded-md flex items-center">
              <Wifi className="h-3 w-3" />
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}
