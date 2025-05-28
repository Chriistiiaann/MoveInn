"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  School,
  Briefcase,
  Calendar,
  MapPin,
  Globe,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { API_GET_ALL_USERS, API_BASE_IMAGE_URL } from "@/utils/endpoints/config"
import { useWebsocket } from "@/context/WebSocketContext"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function UserDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  const { followUser, lastMessage } = useWebsocket()

  const handleFollow = () => {
    if (user?.id) {
      followUser(user.id)
      console.log("🔄 Follow request sent to:", user.id)
    }
  }

  useEffect(() => {
    if (
      lastMessage?.action === "notification" &&
      typeof lastMessage.message === "string"
    ) {
      console.log("✅ Toast fired:", lastMessage.message)
      toast.success(lastMessage.message)
    }
  }, [lastMessage])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(API_GET_ALL_USERS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const found = res.data.find((u: any) => u.id === id)
        setUser(found)
      } catch (err) {
        console.error("Error loading user:", err)
      }
    }

    if (id) fetchUser()
  }, [id])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-gray-500">
        Loading user details...
      </div>
    )
  }

  const userAvatar = user.avatarUrl
    ? API_BASE_IMAGE_URL + user.avatarUrl
    : "/placeholder.svg?height=160&width=160"

  const getSocialIcon = (type: number) => {
    switch (type) {
      case 1:
        return <Facebook className="h-5 w-5" />
      case 2:
        return <Instagram className="h-5 w-5" />
      case 3:
        return <Twitter className="h-5 w-5" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 0:
        return <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">Administrator</span>
      case 1:
        return <span className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">Banned</span>
      case 2:
        return <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">User</span>
      case 3:
        return <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">Host</span>
      default:
        return null
    }
  }

  const followers = user.followers || []
  const following = user.following || []

  const renderUserList = (list: any[], title: string) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text mb-4">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500">No users to display.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((u: any, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <Image
                src={u.avatarUrl || "/default-avatar.svg"}
                alt={u.name}
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="text-text">{u.name} {u.lastName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
  {/* LEFT: Avatar + Name + Bio */}
  <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
    <div
      className={`relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 shadow-lg ${
        user.role === 0
          ? "border-yellow-400"
          : user.role === 1
          ? "border-red-400"
          : user.role === 2
          ? "border-blue-400"
          : "border-green-400"
      }`}
    >
      <Image
        src={userAvatar}
        alt={`${user.name} ${user.lastName || ""}`}
        fill
        className="object-cover"
        unoptimized
        priority
      />
    </div>

    <div className="text-center md:text-left">
      <h1 className="text-3xl font-bold text-text mb-2">
        {user.name} {user.lastName}
      </h1>
      {getRoleBadge(user.role)}
      {user.biography && <p className="mt-4 text-text-secondary max-w-xl">{user.biography}</p>}

      {Array.isArray(user.socialMedias) && user.socialMedias.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
          {user.socialMedias.map((social: any) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {getSocialIcon(social.socialMedia)}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* RIGHT: Follow button + Followers/Following */}
  <div className="flex flex-col items-center gap-4">
    <Button
      className="bg-accent-light text-accent-dark hover:bg-accent w-full"
      onClick={handleFollow}
    >
      Follow
    </Button>
    <div className="flex gap-6">
      <div className="text-center cursor-pointer" onClick={() => setShowFollowers(true)}>
        <p className="text-lg font-bold text-text">{followers.length}</p>
        <p className="text-sm text-gray-500">Followers</p>
      </div>
      <div className="text-center cursor-pointer" onClick={() => setShowFollowing(true)}>
        <p className="text-lg font-bold text-text">{following.length}</p>
        <p className="text-sm text-gray-500">Following</p>
      </div>
    </div>
  </div>
</div>


      {/* Info Cards */}
      <Card className="bg-foreground dark:border-gray-800 shadow-md rounded-xl p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary border-b pb-2">Contact</h3>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-text">{user.mail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-text">{user.phone || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary border-b pb-2">Academic</h3>
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">University</p>
                <p className="text-text">{user.school || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Degree</p>
                <p className="text-text">{user.degree || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary border-b pb-2">Personal</h3>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="text-text">{user.nationality || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Erasmus Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary border-b pb-2">Erasmus</h3>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Erasmus Duration</p>
                <p className="text-text">
                  {user.erasmusDate ? `${user.erasmusDate} days` : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Erasmus Country</p>
                <p className="text-text">{user.erasmusCountry || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Erasmus City</p>
                <p className="text-text">{user.city || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal for followers/following */}
      {(showFollowers || showFollowing) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center">

          <div className="bg-white dark:bg-foreground rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowFollowers(false)
                setShowFollowing(false)
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {showFollowers && renderUserList(followers, "Followers")}
            {showFollowing && renderUserList(following, "Following")}
          </div>
        </div>
      )}
    </div>
  )
}
