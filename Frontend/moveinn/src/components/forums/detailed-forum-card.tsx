import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"
import { Forum } from "@/app/dashboard/forums/page" // o donde tengas tu tipo

interface ForumCardProps {
  forum: Forum
  categoryLabels: Record<number, string>
  categoryBadgeColors: Record<number, string>
  categoryBorderColors: Record<number, string>
  categoryBgColors: Record<number, string>
}

export const ForumCard = ({
  forum,
  categoryLabels,
  categoryBadgeColors,
  categoryBorderColors,
  categoryBgColors
}: ForumCardProps) => {
  console.log("Forum creator info:", forum)

  return (
    <Link href={`/dashboard/forums/${forum.id}`} key={forum.id}>
      <Card className="flex py-0 flex-col justify-between border border-none shadow-md transition-all hover:shadow-lg rounded-md min-h-[280px] lg:min-h-[320px]">
        <CardContent className="p-0 flex flex-col flex-grow bg-foreground rounded-md">
          <div className={`rounded-t-md px-6 pt-6 pb-4 border-b-3 ${categoryBorderColors[forum.category]} bg-gradient-to-br ${categoryBgColors[forum.category] || 'from-gray-100 to-white'}`}>
            <Badge className={`mb-2 w-fit text-xs font-medium px-2 py-1 rounded-md ${categoryBadgeColors[forum.category]}`}>
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
            <div className="mt-auto">
              <div className="flex items-center gap-2 bg-[#4C69DD]/10 rounded-full px-3 py-2 w-fit">
                <Avatar className="h-8 w-8 text-text">
                  <AvatarImage src={`${API_BASE_IMAGE_URL}${forum.creatorAvatar}`} />
                  <AvatarFallback>{forum.creatorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-text">{forum.creatorName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
