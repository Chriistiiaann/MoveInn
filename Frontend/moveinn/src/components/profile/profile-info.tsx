"use client"

import { Briefcase, School, Calendar, Phone, Mail, Globe, MapPin } from 'lucide-react'
import { useAuth } from "@/context/authcontext"
import Image from "next/image"

export function ProfileInfo() {
  const { user } = useAuth()

  if (!user) {
    return <div className="text-gray-800">No user information available</div>
  }

  const formatDate = (dateString: string | number | null | undefined) => {
    if (!dateString) return "Not specified"

    // If it's a number (timestamp), convert to date
    if (typeof dateString === "number") {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString.toString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-secondary border-b dark:border-gray-700 pb-2">Contact</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-text">{user.mail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="text-text">{user.phone || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-secondary border-b dark:border-gray-700 pb-2">Academic</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">University</p>
                <p className="text-text">{user.school || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Degree</p>
                <p className="text-text">{user.degree || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-secondary border-b dark:border-gray-700 pb-2">Personal</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {user.countryFlag ? (
                <div className="h-5 w-7 overflow-hidden rounded-sm">
                  <Image
                    src={user.countryFlag || "/placeholder.svg"}
                    alt="Country flag"
                    width={28}
                    height={20}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <Globe className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nationality</p>
                <p className="text-text">{user.nationality || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Erasmus Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-secondary border-b dark:border-gray-700 pb-2">Erasmus</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erasmus Date</p>
                <p className="text-text">{formatDate(user.erasmusDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.erasmusCountryFlag ? (
                <div className="h-5 w-7 overflow-hidden rounded-sm">
                  <Image
                    src={user.erasmusCountryFlag || "/placeholder.svg"}
                    alt="Erasmus country flag"
                    width={28}
                    height={20}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <Globe className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erasmus Country</p>
                <p className="text-text">{user.erasmusCountry || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erasmus City</p>
                <p className="text-text">{user.city || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
