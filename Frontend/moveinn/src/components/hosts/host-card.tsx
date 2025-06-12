"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Globe, MessageCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config";

interface Specialty {
  id?: string;
  name: string;
}

interface Host {
  id: string;
  name: string;
  avatarUrl?: string;
  school?: string;
  city?: string;
  erasmusCountry?: string;
  nationality?: string;
  biography?: string;
  specialties?: (string | Specialty)[];
}

interface HostCardProps {
  host: Host;
}

export default function HostCard({ host }: HostCardProps) {
  // console.log("Host info:", host)
  return (
    <Link href={`/dashboard/findpeople/${host.id}`} className="cursor-pointer h-full block">
      <Card className="border-none py-0 shadow-md hover:shadow-lg transition-all rounded-md bg-foreground flex flex-col justify-between min-h-[420px]">
        {/* Header */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-accent/50 dark:from-accent/30 to-foreground/10 rounded-t-md flex items-center justify-center border-b-3 border-accent">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={API_BASE_IMAGE_URL + host.avatarUrl || "/default-avatar.svg"} alt={host.name} />
              <AvatarFallback className="bg-[#4C69DD] text-white text-2xl">
                {host.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="absolute top-3 right-3 bg-[#FFBF00] text-[#0E1E40] text-xs font-semibold px-3 py-1 rounded-full shadow">
            Host
          </div>
        </div>

        {/* Content */}
        <CardContent className="px-4 py-3 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="text-center mb-3">
            <h3 className="font-semibold text-lg text-text mb-1">{host.name}</h3>
            {host.biography && (
              <p className="text-sm text-gray-500 dark:text-text-secondary line-clamp-3 max-h-[4.5rem]">
                {host.biography}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {host.city && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {host.city}
              </div>
            )}
            {host.school && (
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                {host.school}
              </div>
            )}
            {host.nationality && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                From {host.nationality}
              </div>
            )}
          </div>

          {/* Specialties */}
          {host.specialties && host.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {host.specialties.slice(0, 3).map((s, i) => (
                <Badge key={typeof s === "string" ? s : s.id || i} className="bg-accent-light text-accent-dark text-xs">
                  {typeof s === "string" ? s : s.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
