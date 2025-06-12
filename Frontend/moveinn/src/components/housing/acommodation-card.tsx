import Image from "next/image"
import { MapPin, BedIcon, BathIcon, Ruler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AccommodationData } from "@/types/accommodation"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"

interface AcommodationCardProps {
  acommodation: AccommodationData
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

export function AcommodationCard({ acommodation }: AcommodationCardProps) {
  const type = typeMap[acommodation.acommodationType] ?? typeMap[4]

  const formattedFrom = new Date(acommodation.availableFrom).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })

  const formattedTo = new Date(acommodation.availableTo).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })

  const image = acommodation.images?.[0]
    ? `${API_BASE_IMAGE_URL}${acommodation.images[0]}`
    : "/placeholder.svg"

  return (
    <Card className="flex flex-col justify-between min-h-[420px] h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-foreground border-none py-0">
  {/* Imagen + badge + título + ubicación juntos */}
  <div className="relative pb-0 h-auto w-full">
    {/* Imagen */}
    <div className="relative h-48">
      <Image
        src={image}
        alt={acommodation.title}
        fill
        unoptimized
        className="object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
      <div className="absolute top-3 left-3">
        <Badge className={`text-xs font-semibold rounded-md px-2 py-1 ${type.badgeColor}`}>
          {type.label}
        </Badge>
      </div>
    </div>

    {/* Fondo degradado + título + localización */}
    <div className={`w-full bg-gradient-to-br ${type.bgColor} border-b-[3px] ${typeMapBorder[acommodation.acommodationType].borderColor}`}>

      <div className="px-4 pt-2 pb-3 flex flex-col justify-center">
        <h3 className="font-semibold text-lg text-text mb-1 line-clamp-1">{acommodation.title}</h3>
        <div className="flex items-center bg-foreground/10 dark:bg-foreground/40 w-fit px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-200">
          <MapPin className="h-4 w-4 text-primary mr-1" />
          {acommodation.city}, {acommodation.country}
        </div>
      </div>
    </div>
  </div>

  {/* Description + badges */}
  <CardContent className="flex-1 flex flex-col justify-between pt-0 px-4 pb-3">
    <div>
      <p className="text-sm text-text dark:text-gray-200 mb-3 line-clamp-3 min-h-[60px]">{acommodation.description}</p>
    </div>

    <div className="flex gap-2 text-xs mt-auto">
      <Badge className="bg-primary text-white dark:bg-[#4C69DD]/10 dark:text-text-secondary">
        {acommodation.numberOfRooms} <BedIcon className="ml-1 h-3.5 w-3.5" />
      </Badge>
      <Badge className="bg-secondary text-green-900 dark:bg-[#62C3BA]/10 dark:text-[#62C3BA]">
        {acommodation.bathrooms} <BathIcon className="ml-1 h-3.5 w-3.5" />
      </Badge>
      <Badge className="bg-accent text-accent-dark dark:bg-accent-light/20 dark:text-accent">
        {acommodation.squareMeters}m² <Ruler className="ml-1 h-3.5 w-3.5" />
      </Badge>
    </div>
  </CardContent>

  {/* Footer */}
  <CardFooter className="p-3 pt-0 flex justify-between items-center">
    <div className="text-sm text-gray-500 dark:text-gray-300">
      {formattedFrom} – {formattedTo}
    </div>
    <div className="text-right">
      <div className="text-xl font-bold text-primary-dark">
        €{acommodation.pricePerMonth}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">per month</div>
    </div>
  </CardFooter>
</Card>

  )
}
