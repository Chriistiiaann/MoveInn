"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, GraduationCap, Globe } from "lucide-react"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"

type Props = {
  user: any
  onClick: () => void
}

export default function UserCard({ user, onClick }: Props) {
  return (
    <div onClick={onClick} className="cursor-pointer h-full">
      <Card className="border-none py-0 shadow-md hover:shadow-lg transition-all rounded-md bg-foreground flex flex-col justify-between min-h-[420px]">
        {/* Header */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-[#4C69DD]/20 to-[#62C3BA]/20 rounded-t-md flex items-center justify-center border-b-3 border-primary">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={API_BASE_IMAGE_URL + user.avatarUrl || "/default-avatar.svg"} alt={user.name} />
              <AvatarFallback className="bg-[#4C69DD] text-white text-2xl">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {user.erasmusCountry && (
            <div className="absolute top-3 right-3 bg-accent text-[#0E1E40] text-xs font-semibold px-3 py-1 rounded-full shadow">
              Erasmus in <span className="font-bold">{user.erasmusCountry}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="px-4 py-3 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="text-center mb-2">
            <h3 className="font-semibold text-lg text-text mb-1">
              {user.name} {user.lastName}
            </h3>
            {user.biography && (
              <p className="text-sm text-gray-500 dark:text-text-secondary line-clamp-3 max-h-[4.5rem] mb-3">
                {user.biography}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {user.city && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {user.city}
              </div>
            )}
            {user.school && (
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                {user.school}
              </div>
            )}
            {user.nationality && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                From {user.nationality}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
