import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, ExternalLink, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { API_BASE } from "@/utils/endpoints/config"
import { DetailedRecommendationCardProps } from "@/types/recommendation"

const categoryByNumber: Record<number, string> = {
  0: "Restaurant",
  1: "Cafeteria",
  2: "Museum",
  3: "LeisureZone",
  4: "Park",
  5: "HistoricalSite",
  6: "Shopping",
  7: "Bar",
  8: "Other",
}

export function DetailedRecommendationCard({
  recommendation,
  categoryIcon,
}: DetailedRecommendationCardProps) {
  const categoryName = categoryByNumber[recommendation.category] || "Other"
  const categorySlug = categoryName.toLowerCase()

  const mainImage = recommendation.recommendationImages?.[0]?.url
    ? `/uploads/${recommendation.recommendationImages[0].url}`
    : "/placeholder.svg"

  const getCategoryColor = () => {
    switch (categorySlug) {
      case "restaurant": return "from-[#B7F8C8]/30 to-foreground"
      case "cafeteria": return "from-pink-100 dark:from-[#ffbfea]/50 to-foreground"
      case "museum": return "from-[#4C69DD]/20 to-foreground"
      case "leisurezone": return "from-amber-200 dark:from-[#723917]/50 to-foreground"
      case "park": return "from-green-100 dark:from-secondary-greenblue/30 to-foreground"
      case "historicalsite": return "from-yellow-100 dark:from-yellow-200/50 to-foreground"
      case "shopping": return "from-purple-100 dark:from-[#ccb1ef]/50 to-foreground"
      case "bar": return "from-[#0E1E40]/30 dark:from-[#0E1E40]/50 to-foreground"
      case "other": return "from-gray-200 dark:from-gray-400/20 to-foreground"
      default: return "from-gray-200 to-foreground"
    }
  }

  const getCategoryBadgeColor = () => {
    switch (categorySlug) {
      case "restaurant": return "bg-secondary text-green-900"
      case "cafeteria": return "bg-pink-200 text-pink-900"
      case "museum": return "bg-primary text-white"
      case "leisurezone": return "bg-amber-400 text-amber-900"
      case "park": return "bg-secondary-greenblue text-green-900"
      case "historicalsite": return "bg-yellow-200 text-yellow-900"
      case "shopping": return "bg-purple-200 text-purple-900"
      case "bar": return "bg-[#0E1E40] text-white"
      case "other": return "bg-gray-300 text-gray-800"
      default: return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <Card className="flex flex-col py-0 justify-between h-full min-h-[480px] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-foreground border-none">
      {/* Imagen + info superior + fondo de color */}
      <div className="relative w-full">
        <div className="relative h-48">
          <Image
            src={`https://${API_BASE}/` + recommendation.recommendationImages[0].url}
            alt={recommendation.title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryBadgeColor()}>
              <span className="flex items-center">
                {categoryIcon}
                <span className="ml-1 truncate max-w-[120px]">{categoryName}</span>
              </span>
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-xs font-medium text-white">{recommendation.rating}</span>
          </div>
        </div>

        <div className={`w-full bg-gradient-to-br ${getCategoryColor()}`}>
          <div className="px-4 pt-2 pb-3 flex flex-col justify-center">
            <h3 className="font-semibold text-lg text-text mb-1 line-clamp-1">{recommendation.title}</h3>
            <div className="flex items-center bg-foreground/10 w-fit px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-200">
              <MapPin className="h-4 w-4 text-primary mr-1" />
              <span className="line-clamp-1 max-w-[200px]">{recommendation.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido inferior */}
      <CardContent className="px-4 flex-1">
        <p className="text-sm text-text mb-3 line-clamp-3">{recommendation.description}</p>
      </CardContent>

      <CardContent className="px-4 pt-0">
        {recommendation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 max-h-[52px] overflow-hidden">
            {recommendation.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs py-0 px-1.5 border-primary text-primary dark:text-text-secondary dark:border-text-secondary truncate max-w-[80px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
          Recommended by{" "}
          <span className="font-semibold text-primary dark:text-text-secondary">
            {recommendation.userId === "00000000-0000-0000-0000-000000000000" ? "system" : recommendation.userId}
          </span>
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="text-[#4C69DD] border-[#4C69DD]/30 hover:bg-[#4C69DD]/10">
          <Share2 className="h-3.5 w-3.5 mr-1" />
          Share
        </Button>
        <Link href={`/dashboard/recommendations/${recommendation.id}`}>
          <Button size="sm" className="text-white bg-[#4C69DD] hover:bg-[#4C69DD]/90">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
