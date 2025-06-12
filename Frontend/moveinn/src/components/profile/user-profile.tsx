"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileInfo } from "./profile-info"
import { ProfileEdit } from "./profile-edit"
import { Facebook, Instagram, Twitter, FileEdit, User, Linkedin, Github, X, TwitterIcon, TableOfContents } from "lucide-react"
import { SOCIAL_MEDIA_TYPES } from "@/types/user"
import { useAuth } from "@/context/authcontext"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"
import { UserContentOverview } from "./user-content"
import axios from "axios"
import { getCookie } from "cookies-next"
import { API_USER_FOLLOWERS, API_USER_FOLLOWING } from "@/utils/endpoints/config"
import { useWebsocket } from "@/context/WebSocketContext"
import Link from "next/link"


export function UserProfile() {
  const { user } = useAuth()
  const { socket, lastMessage } = useWebsocket()
  const [activeTab, setActiveTab] = useState("info")

  console.log(user)

  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [fetchedFollowers, setFetchedFollowers] = useState<any[]>([])
  const [fetchedFollowing, setFetchedFollowing] = useState<any[]>([])

  if (!user) {
    return <div className="text-gray-800">No user information available</div>
  }

  useEffect(() => {
    if (!lastMessage) return;
  
    if (
      lastMessage.action === "receive_counts" &&
      lastMessage.targetId === user?.id
    ) {
      setFollowerCount(lastMessage.followers);
      setFollowingCount(lastMessage.followings);
      console.log("🔄 [WS] Contadores actualizados:", lastMessage.followers, lastMessage.followings);
    }
  }, [lastMessage, user?.id]);

  useEffect(() => {
    if (!user?.id || !socket) return;
  
    const payload = {
      action: "subscribe_counts",
      targetUserId: user.id,
    };
  
    const sendWhenReady = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        console.log("📡 [WS] Subscribed to follower updates:", payload);
      } else if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", () => {
          socket.send(JSON.stringify(payload));
          console.log("📡 [WS] Subscribed after connect:", payload);
        }, { once: true });
      } else {
        console.warn("❌ [WS] Cannot subscribe, state:", socket.readyState);
      }
    };
  
    sendWhenReady();
  }, [user?.id, socket]);
  
  

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = getCookie("token")
        const headers = { Authorization: `Bearer ${token}` }
  
        const [followersRes, followingRes] = await Promise.all([
          axios.get(API_USER_FOLLOWERS(user.id), { headers }),
          axios.get(API_USER_FOLLOWING(user.id), { headers }),
        ])
  
        setFollowerCount(followersRes.data?.length || 0)
        setFollowingCount(followingRes.data?.length || 0)
      } catch (err) {
        console.error("❌ Error fetching follower/following counts:", err)
      }
    }
  
    if (user?.id) fetchCounts()
  }, [user?.id])

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!showFollowersModal || !user?.id) return
        const token = getCookie("token")
        const res = await axios.get(API_USER_FOLLOWERS(user.id), {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("res followers", res.data)
        setFetchedFollowers(res.data || [])
      } catch (err) {
        console.error("❌ Error fetching followers list:", err)
      }
    }
    fetchFollowers()
  }, [showFollowersModal, user?.id])
  
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        if (!showFollowingModal || !user?.id) return
        const token = getCookie("token")
        const res = await axios.get(API_USER_FOLLOWING(user.id), {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFetchedFollowing(res.data || [])
      } catch (err) {
        console.error("❌ Error fetching following list:", err)
      }
    }
    fetchFollowing()
  }, [showFollowingModal, user?.id])  

  const getSocialIcon = (type: number) => {
    switch (type) {
      case 1:
        return <Facebook className="h-5 w-5" />
      case 2:
        return <Instagram className="h-5 w-5" />
      case 3:
        return <Twitter className="h-5 w-5" />

    }
  }

  const userAvatar = user.avatarUrl
  ? `${API_BASE_IMAGE_URL + user.avatarUrl}?v=${user.updatedAt || Date.now()}`
  : "/placeholder.svg?height=160&width=160";

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 0:
        return (
          <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full shadow-sm border border-yellow-200">
            Administrator
          </span>
        )
      case 1:
        return (
          <span className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full shadow-sm border border-red-200">
            Banned
          </span>
        )
      case 2:
        return (
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full shadow-sm border border-blue-200">
            User
          </span>
        )
      case 3:
        return (
          <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full shadow-sm border border-green-200">
            Host
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with profile photo and name */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div
          className={`relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 shadow-lg ${
            user.role === 0
              ? "border-yellow-400"
              : user.role === 1
                ? "border-red-400"
                : user.role === 2
                  ? "border-blue-400"
                  : user.role === 3
                    ? "border-green-400"
                    : "border-primary"
          }`}
        >
          {user.avatarUrl === "default-avatar-url" || !user.avatarUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-primary text-white text-6xl font-bold uppercase">
              {user.name?.charAt(0)}
            </div>
          ) : (
            <Image
              src={userAvatar}
              alt={`${user.name} ${user.lastName || ""}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}

        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-text mb-2">
            {user.name} {user.lastName || ""}
          </h1>
          {getRoleBadge(user.role)}

          <div className="flex gap-6 mt-4 justify-center md:justify-start">
            <div className="text-center cursor-pointer" onClick={() => setShowFollowersModal(true)}>
              <p className="text-lg font-bold text-text">{followerCount}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setShowFollowingModal(true)}>
              <p className="text-lg font-bold text-text">{followingCount}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>


          {user.biography && <p className="px-1 mt-6 text-text-secondary max-w-2xl">{user.biography}</p>}

          {user.socialMedias && user.socialMedias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {user.socialMedias.map((social) => (
                <a
                  key={`${social.id}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  title={SOCIAL_MEDIA_TYPES[social.socialMedia as keyof typeof SOCIAL_MEDIA_TYPES] || "Social Media"}
                >
                  {getSocialIcon(social.socialMedia)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {Array.isArray(user.languages) && user.languages.length > 0 && (
  <div className="mt-6">
    <h3 className="text-sm font-semibold text-text mb-1 text-center md:text-left">Languages</h3>
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm mt-2">
      {user.languages.map((lang: any, i: number) => {
        const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];
        const levelColors = [
          "bg-red-100 text-red-800 dark:bg-red-100/90",
          "bg-orange-100 text-orange-800 dark:bg-orange-100/90",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-100/90",
          "bg-green-100 text-green-800 dark:bg-green-100/90",
          "bg-blue-100 text-blue-800 dark:bg-blue-100/90",
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-100/90",
          "bg-purple-100 text-purple-800 dark:bg-purple-100/90",
        ];
        const levelText = levels[lang.level] || "Unknown";
        const colorClass = levelColors[lang.level] || "bg-gray-100 text-gray-800";

        return (
          <li
            key={`${lang.language}-${i}`}
            className={`px-3 py-1 rounded-full shadow-sm text-center ${colorClass}`}
          >
            {lang.language} <span className="text-xs">— {levelText}</span>
          </li>
        );
      })}
    </ul>
  </div>
)}



      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-2">
        <TabsList className="flex flex-wrap justify-center gap-2 w-fit max-w-full mx-auto bg-background h-fit p-1 rounded-lg shadow-inner">

            <TabsTrigger
              value="info"
              className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
        ${
          activeTab === "info"
            ? "bg-white text-primary shadow-sm border border-gray-200"
            : "text-primary hover:text-primary hover:bg-white/50"
        }
      `}
            >
              <User className="h-4 w-4" />
              <span>Information</span>
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
        ${
          activeTab === "edit"
            ? "bg-white text-primary shadow-sm border border-gray-200"
            : "text-primary hover:text-primary hover:bg-white/50"
        }
      `}
            >
              <FileEdit className="h-4 w-4" />
              <span>Edit Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
        ${
          activeTab === "content"
            ? "bg-white text-primary shadow-sm border border-gray-200"
            : "text-primary hover:text-primary hover:bg-white/50"
        }
      `}
            >
              <TableOfContents className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="mt-6">
          <Card className="border-none shadow-sm bg-foreground">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-text">Personal Information</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Details of your user profile</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileInfo user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <Card className="border-none shadow-sm bg-foreground">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-text">Edit Profile</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileEdit onSuccess={() => setActiveTab("info")} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="mt-6">
          <UserContentOverview />
        </TabsContent>
      </Tabs>

      {(showFollowersModal || showFollowingModal) && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white dark:bg-foreground rounded-lg shadow-lg max-w-md w-full p-6 relative">
      <button
        onClick={() => {
          setShowFollowersModal(false)
          setShowFollowingModal(false)
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      {showFollowersModal && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Followers</h2>
    {fetchedFollowers.length === 0 ? (
      <p className="text-gray-500">No followers yet.</p>
    ) : (
      <ul className="space-y-3">
        {fetchedFollowers.map((u: any) => (
          <Link href={`/dashboard/findpeople/${u.id}`} key={u.id}>
          <li key={u.id} className="flex items-center gap-3 cursor-pointer hover:bg-accent/20 rounded-md px-1 transition-all duration-200">
            {u.avatarUrl === "default-avatar-url" ? (
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                {u.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <Image
                src={API_BASE_IMAGE_URL + u.avatarUrl}
                alt={u.name}
                width={36}
                height={36}
                className="rounded-full"
                unoptimized
              />
            )}

            <div>
              <p className="text-text font-medium text-lg">{u.name}</p>
              <p className="text-sm text-gray-600 dark:text-text-secondary">{u.city} · {u.erasmusCountry}</p>
            </div>
          </li>
          </Link>
        ))}
      </ul>
    )}
  </div>
)}

      {showFollowingModal && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Following</h2>
          {fetchedFollowing.length === 0 ? (
            <p className="text-gray-500">You're not following anyone.</p>
          ) : (
            <ul className="space-y-3">
              {fetchedFollowing.map((u: any) => (
                <Link href={`/dashboard/findpeople/${u.id}`} key={u.id} className="my-2">
                <li key={u.id} className="flex items-center gap-3 cursor-pointer hover:bg-accent/20 rounded-md px-1 transition-all duration-200">
                  {u.avatarUrl === "default-avatar-url" ? (
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <Image
                      src={API_BASE_IMAGE_URL + u.avatarUrl}
                      alt={u.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <div>
                    <p className="text-text font-medium">{u.name}</p>
                    <p className="text-sm text-gray-600 dark:text-text-secondary">{u.city} · {u.erasmusCountry}</p>
                  </div>
                </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>
)}
    </div>  
  )
}
