import { useEffect, useState } from "react"
import { MapPinIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { API_BASE_URL } from "@/utils/endpoints/config"
import { id } from "date-fns/locale"
import Link from "next/link"
import { getCookie } from "cookies-next"

interface RecommendationCardProps {
  name: string
  category: string
  rating: number
  description: string
  recommendedBy: string
  id: string
}

const API_GET_USER = (id: string) => `${API_BASE_URL}/User/${id}`

export function RecommendationCard({
  name,
  category,
  rating,
  description,
  recommendedBy,
  id,
}: RecommendationCardProps) {
  const [recommenderName, setRecommenderName] = useState<string>("")

  const categorySlug = category.toLowerCase()

  const getCategoryColor = () => {
    switch (categorySlug) {
      case "restaurant":
        return "from-[#B7F8C8]/30 to-foreground"
      case "cafeteria":
        return "from-pink-100 dark:from-[#ffbfea]/50 to-foreground"
      case "museum":
        return "from-[#4C69DD]/20 to-foreground"
      case "leisurezone":
        return "from-amber-200 dark:from-[#723917]/50 to-foreground"
      case "park":
        return "from-green-100 dark:from-secondary-greenblue/30 to-foreground"
      case "historicalsite":
        return "from-yellow-100 dark:from-yellow-200/50 to-foreground"
      case "shopping":
        return "from-purple-100 dark:from-[#ccb1ef]/50 to-foreground"
      case "bar":
        return "from-[#0E1E40]/30 dark:from-[#0E1E40]/50 to-foreground"
      case "other":
        return "from-gray-200 dark:from-gray-400/20 to-foreground"
      default:
        return "from-gray-200 to-foreground"
    }
  }

  const getCategoryBadgeColor = () => {
    switch (categorySlug) {
      case "restaurant":
        return "bg-secondary text-green-900"
      case "cafeteria":
        return "bg-pink-200 text-pink-900"
      case "museum":
        return "bg-primary text-white"
      case "leisurezone":
        return "bg-amber-400 text-amber-900"
      case "park":
        return "bg-secondary-greenblue text-green-900"
      case "historicalsite":
        return "bg-yellow-200 text-yellow-900"
      case "shopping":
        return "bg-purple-200 text-purple-900"
      case "bar":
        return "bg-[#0E1E40] text-white"
      case "other":
        return "bg-gray-300 text-gray-800"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const getCategoryColorBorder = () => {
    switch (categorySlug) {
      case "restaurant": return "border-secondary"
      case "cafeteria": return "border-pink-200"
      case "museum": return "border-primary"
      case "leisurezone": return "border-amber-400"
      case "park": return "border-secondary-greenblue"
      case "historicalsite": return "border-yellow-200"
      case "shopping": return "border-purple-200"
      case "bar": return "border-[#0E1E40]"
      case "other": return "border-gray-200"
      default: return "border-gray-200"
    }
  }

  useEffect(() => {
    const fetchUserName = async () => {
      if (recommendedBy && recommendedBy !== "00000000-0000-0000-0000-000000000000") {
        try {
          const token = getCookie("token")
          const response = await axios.get(API_GET_USER(recommendedBy), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const userData = response.data
          setRecommenderName(userData.name)
        } catch (error) {
          console.error("Error fetching user name:", error)
          setRecommenderName("Unknown User")
        }
      } else {
        setRecommenderName("System")
      }
    }

    fetchUserName()
  }, [recommendedBy])

  return (
    <Link href={`/dashboard/recommendations/${id}`}>
    <div
      className={`p-4 rounded-[var(--radius-lg)] hover:border-background/50 bg-gradient-to-br ${getCategoryColor()} border-l-3 ${getCategoryColorBorder()} transition-all hover:shadow-md 
      flex flex-col min-h-[200px]`} // Quité justify-between
    >
      <div className="flex-grow"> {/* Este div ocupa el espacio disponible */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-text">{name}</h3>
          <div className="flex items-center bg-amber-100 px-2 py-0.5 rounded-full">
            <StarIcon className="h-3.5 w-3.5 text-amber-500 mr-1" />
            <span className="text-sm font-medium text-amber-700">{rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge className={getCategoryBadgeColor()}>{category}</Badge>
        </div>

        <p className="text-sm text-text mb-3 line-clamp-3">{description}</p>
      </div>

      <div className="flex items-center text-xs bg-background/50 dark:bg-background/50 px-2 py-1 rounded-full w-fit">
        <MapPinIcon className="h-3 w-3 mr-1 text-primary" />
        <p className="text-gray-600 dark:text-gray-300">Recommended by <span className="font-semibold text-primary dark:text-text-secondary">{recommenderName}</span></p>
      </div>
    </div>
    </Link>
  )
}
