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
  User,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { API_GET_USER, API_BASE_IMAGE_URL } from "@/utils/endpoints/config"
import { useWebsocket } from "@/context/WebSocketContext"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { OtherUserContentOverview } from "@/components/findpeople/other-user-content"
import { useAuth } from "@/context/authcontext";
import { API_USER_FOLLOWING, API_USER_FOLLOWERS } from "@/utils/endpoints/config";
import { getCookie } from "cookies-next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TableOfContents } from "lucide-react"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"


export default function UserDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  const [fetchedFollowers, setFetchedFollowers] = useState<any[]>([]);
  const [fetchedFollowing, setFetchedFollowing] = useState<any[]>([]);

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  const { user: authUser } = useAuth()
  const { socket, followUser, unfollowUser, lastMessage } = useWebsocket()

  const handleFollow = () => {
    if (user?.id) {
      followUser(user.id)
      console.log("🔄 Follow request sent to:", user.id)
      setIsFollowing(true);
    }
  }

  const handleUnfollow = () => {
    if (user?.id) {
      unfollowUser(user.id);
      console.log("🚫 Unfollow request sent to:", user.id);
      // toast.success(`Has dejado de seguir a ${user.name}`);
      setIsFollowing(false);
      setShowUnfollowModal(false);
    }
  };

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        if (!showFollowing || !user?.id) return;
  
        const token = getCookie("token");
        const res = await axios.get(API_USER_FOLLOWING(user.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setFetchedFollowing(res.data || []);
        console.log("✅ Fetched following:", res.data);
      } catch (err) {
        console.error("❌ Error fetching following list:", err);
      }
    };
  
    fetchFollowing();
  }, [showFollowing, user?.id]);  
  

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        if (!showFollowers || !user?.id) return;
  
        const token = getCookie("token");
        const res = await axios.get(API_USER_FOLLOWERS(user.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setFetchedFollowers(res.data || []);
        console.log("✅ Fetched followers:", res.data);
      } catch (err) {
        console.error("❌ Error fetching followers:", err);
      }
    };
  
    fetchFollowers();
  }, [showFollowers, user?.id]);
  

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
        socket.addEventListener(
          "open",
          () => {
            socket.send(JSON.stringify(payload));
            console.log("📡 [WS] Subscribed after connect:", payload);
          },
          { once: true }
        );
      } else {
        console.warn("❌ [WS] Cannot subscribe, state:", socket.readyState);
      }
    };
  
    sendWhenReady();
  }, [user?.id, socket]);
  
  

  useEffect(() => {
    if (!lastMessage) return;
  
    // Notificaciones normales
    if (lastMessage?.action === "notification" && typeof lastMessage.message === "string") {
      toast.success(lastMessage.message);
    }
  
    // Conteo de followers en tiempo real
    if (lastMessage.action === "receive_counts" && lastMessage.targetId === user?.id) {
      setFollowerCount(lastMessage.followers);
      setFollowingCount(lastMessage.followings);
      console.log("📬 Live counts received:", lastMessage.followers, lastMessage.followings);
    }
  }, [lastMessage, user?.id]);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getCookie("token");
        const res = await axios.get(API_GET_USER(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data;
        console.log("✅ User found:", found);
        setUser(found);
      } catch (err) {
        console.error("❌ Error loading user:", err);
      }
    };
  
    if (id) fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = getCookie("token");
        if (!authUser?.id || !user?.id) {
          console.log("❌ IDs not ready yet → authUser:", authUser?.id, "| user:", user?.id);
          return;
        }
  
        const followingRes = await axios.get(API_USER_FOLLOWING(authUser.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const isUserFollowed = followingRes.data.some((u: any) => u.id === user.id);
        setIsFollowing(isUserFollowed);
      } catch (err) {
        console.error("❌ Error fetching following list:", err);
      }
    };
  
    fetchFollowing();
  }, [authUser, user]);
  
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
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
          {list.map((u: any, i: number) => {
            const isCurrentUser = authUser?.id === u.id
            return (
              <li
                key={u.id}
                className={`flex items-center gap-3 ${isCurrentUser ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-muted/30 p-2 rounded-md'}`}
                onClick={() => {
                  if (!isCurrentUser) {
                    window.location.href = `/dashboard/findpeople/${u.id}`
                  }
                }}
              >
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
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-text font-medium">{u.name}</p>
                    {isCurrentUser && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-text-secondary">
                    {u.city} · {u.erasmusCountry}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
  

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6">
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
          unoptimized
          priority
        />
      )}

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
  {isFollowing ? (
  <Button
    variant="outline"
    className="text-primary border-primary hover:bg-primary/10 dark:hover:bg-primary/10 w-full"
    onClick={() => setShowUnfollowModal(true)}
  >
    Following
  </Button>
) : (
  <Button
    className="bg-accent-light text-accent-dark hover:bg-accent hover:text-accent-dark dark:hover:bg-accent-dark dark:hover:text-accent-light w-full"
    onClick={handleFollow}
  >
    Follow
  </Button>
)}


    <div className="flex gap-6">
      <div className="text-center cursor-pointer" onClick={() => setShowFollowers(true)}>
        <p className="text-lg font-bold text-text">{followerCount}</p>
        <p className="text-sm text-gray-500">Followers</p>
      </div>
      <div className="text-center cursor-pointer" onClick={() => setShowFollowing(true)}>
        <p className="text-lg font-bold text-text">{followingCount}</p>
        <p className="text-sm text-gray-500">Following</p>
      </div>
    </div>
  </div>
</div>

{/* Idiomas del usuario */}
{Array.isArray(user.languages) && user.languages.length > 0 && (
  <div className="mt-4">
    <h3 className="text-sm font-semibold text-text mb-1">Languages</h3>
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">

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
            {lang.language} <span className="text-xs">{levelText}</span>
          </li>
        );
      })}
    </ul>
  </div>
)}

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

            {showFollowers && renderUserList(fetchedFollowers, "Followers")}
            {showFollowing && renderUserList(fetchedFollowing, "Following")}

          </div>
        </div>
      )}
      <Tabs defaultValue="info" className="w-full mt-10">
  <div className="flex justify-center mb-2">
    <TabsList className="flex flex-wrap justify-center gap-2 w-fit max-w-full mx-auto bg-background h-fit p-1 rounded-lg shadow-inner">
      <TabsTrigger
        value="info"
        className={`
          flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100/20 hover:text-primary
          data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200
        `}
      >
        <User className="h-4 w-4" />
        <span>Information</span>
      </TabsTrigger>
      <TabsTrigger
        value="content"
        className={`
          flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100/20 hover:text-primary
          data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200
        `}
      >
        <TableOfContents className="h-4 w-4" />
        <span>Content</span>
      </TabsTrigger>
    </TabsList>
  </div>

  {/* Info Tab */}
  <TabsContent value="info" className="mt-6">
    <Card className="border-none shadow-sm bg-foreground">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-text">User Information</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">Details and profile data</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary dark:border-gray-700 border-b pb-2">Contact</h3>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-text">{user.mail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-text">{user.phone || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary dark:border-gray-700 border-b pb-2">Academic</h3>
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">University</p>
                <p className="text-text">{user.school || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Degree</p>
                <p className="text-text">{user.degree || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary dark:border-gray-700 border-b pb-2">Personal</h3>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
                <p className="text-text">{user.nationality || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Erasmus Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-secondary dark:border-gray-700 border-b pb-2">Erasmus</h3>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Erasmus Duration</p>
                <p className="text-text">
                  {user.erasmusDate ? `${user.erasmusDate} days` : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Erasmus Country</p>
                <p className="text-text">{user.erasmusCountry || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Erasmus City</p>
                <p className="text-text">{user.city || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Content Tab */}
  <TabsContent value="content" className="mt-6">
    <OtherUserContentOverview userId={user.id} />
  </TabsContent>
</Tabs>

      {showUnfollowModal && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-foreground rounded-lg shadow-lg p-6 max-w-sm w-full text-center space-y-4">
      <h2 className="text-lg font-semibold text-text">Unfollow {user.name}?</h2>
      <p className="text-sm text-text-secondary">
        Are you sure you want to unfollow this user?
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="ghost" className="dark:text-text-secondary" onClick={() => setShowUnfollowModal(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={handleUnfollow}
        >
          Unfollow
        </Button>
      </div>
    </div>
  </div>
)}


    </div>
  )
}
