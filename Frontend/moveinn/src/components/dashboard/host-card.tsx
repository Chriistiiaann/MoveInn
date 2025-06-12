import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Host {
  id: string
  name: string
  school: string
  avatarUrl: string
  specialties: { id: string; name: string }[]
}

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  const initials = host.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const languages = host.specialties?.map((s) => s.name) || []

  return (
    <div className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-gradient-to-br from-accent/20 to-foreground">
      <Avatar className="h-10 w-10 border-2 border-[#B7F8C8]">
        <AvatarImage src={host.avatarUrl || "/placeholder.svg?height=40&width=40"} alt={host.name} />
        <AvatarFallback className="bg-[#4C69DD] text-white">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h3 className="font-medium text-text">{host.name}</h3>
        <p className="text-xs text-gray-400 mb-1">{host.school}</p>

        <div className="flex flex-wrap gap-1 mb-2">
          {languages.map((lang, index) => (
            <Badge
              key={lang}
              variant="outline"
              className={`text-xs py-0 px-1.5 ${
                index === 0
                  ? "border-[#4C69DD] text-[#4C69DD] dark:text-text-secondary dark:border-text-secondary"
                  : index === 1
                  ? "border-[#62C3BA] text-[#62C3BA]"
                  : "border-accent text-accent"
              }`}
            >
              {lang}
            </Badge>
          ))}
        </div>

        <Link href={`/dashboard/hosts/${host.id}`}>
          <Button variant="ghost" size="sm" className="h-7 text-[#4C69DD] hover:bg-[#4C69DD]/10 p-1 dark:text-text-secondary">
            View profile
          </Button>
        </Link>
      </div>
    </div>
  )
}
