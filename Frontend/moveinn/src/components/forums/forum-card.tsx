"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"

const categoryLabels: Record<number, string> = {
  0: "Procedures & Docs",
  1: "University Life",
  2: "Cultural & Social",
  3: "Scholarships",
  4: "Transport",
  5: "Tourism & Nightlife",
  6: "Events",
  7: "Tips",
  8: "FAQ",
  9: "Other"
}

const forumCategoryColors: Record<number, string> = {
  0: "from-[#B7F8C8]/30 to-foreground",
  1: "from-yellow-100 dark:from-yellow-200/50 to-foreground",
  2: "from-pink-100 dark:from-[#ffbfea]/50 to-foreground",
  3: "from-purple-100 dark:from-[#ccb1ef]/50 to-foreground",
  4: "from-green-100 dark:from-secondary-greenblue/30 to-foreground",
  5: "from-amber-200 dark:from-[#723917]/50 to-foreground",
  6: "from-[#0E1E40]/30 dark:from-[#0E1E40]/50 to-foreground",
  7: "from-[#4C69DD]/20 to-foreground",
  8: "from-gray-200 dark:from-gray-400/20 to-foreground",
  9: "from-gray-200 dark:from-gray-400/20 to-foreground",
}

const forumCategoryBadgeColors: Record<number, string> = {
  0: "bg-secondary text-green-900",
  1: "bg-yellow-200 text-yellow-900",
  2: "bg-pink-200 text-pink-900",
  3: "bg-purple-200 text-purple-900",
  4: "bg-secondary-greenblue text-green-900",
  5: "bg-amber-400 text-amber-900",
  6: "bg-[#0E1E40] text-white",
  7: "bg-primary text-white",
  8: "bg-gray-300 text-gray-800",
  9: "bg-gray-200 text-gray-700",
}

const forumCategoryBorderColors: Record<number, string> = {
  0: "border-secondary",
  1: "border-yellow-200",
  2: "border-pink-200",
  3: "border-purple-200",
  4: "border-secondary-greenblue",
  5: "border-amber-400",
  6: "border-[#0E1E40]",
  7: "border-primary",
  8: "border-gray-300",
  9: "border-gray-200",
}

export interface Forum {
    id: string
    title: string
    description: string
    country: string
    category: number
    createdAt: string
    creatorId: string
    creatorName: string
    creatorAvatar: string
}


export default function ForumCard({ forum }: { forum: Forum }) {
  console.log("Forum creator info:", forum)

  return (
    <Link href={`/dashboard/forums/${forum.id}`}>
      <Card className="flex flex-col bg-none py-0 px-0 justify-between border border-none shadow-md transition-all hover:shadow-lg rounded-md min-h-[280px] lg:min-h-[320px]">
        <CardContent className="p-0 flex flex-col flex-grow bg-foreground rounded-md">
          <div className={`rounded-t-md px-6 pt-6 pb-4 border-b-3 ${forumCategoryBorderColors[forum.category]} bg-gradient-to-br ${forumCategoryColors[forum.category] || 'from-gray-100 to-white'}`}>
            <Badge className={`mb-2 w-fit text-xs font-medium px-2 py-1 rounded-md ${forumCategoryBadgeColors[forum.category]}`}>
              {categoryLabels[forum.category]}
            </Badge>
            <h3 className="font-bold text-text text-lg mb-2">{forum.title}</h3>
            <div className="flex items-center text-xs text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-foreground rounded-md px-2 py-1 justify-between mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#4C69DD]" />
                {forum.country}
              </span>
              <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-6 pt-4 flex-grow flex flex-col bg-foreground rounded-b-md border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-text line-clamp-3 lg:line-clamp-5 mb-4">{forum.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
