"use client"
import {
    CalendarIcon,
    Users2Icon,
    MessageCircleIcon,
    MapPin,
    PlusCircleIcon,
    MapPinIcon,
    ChevronRightIcon,
    GlobeIcon,
    TrendingUpIcon,
    UsersIcon,
    Utensils,
    Coffee,
    Landmark,
    Music,
    GraduationCap,
    Bike,
    Grid3X3,
    Plus,
    X,
    Map,
    CalendarX,
    SearchX,
    UserX,
    BellIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EventCard } from "@/components/dashboard/event-card"
import { NotificationItem } from "@/components/dashboard/notification-item"
import { RecommendationCard } from "@/components/dashboard/recommendation-card"
import { DashboardAcommodationCard } from "@/components/dashboard/dashboard-acommodation-card"
import { HostCard } from "@/components/dashboard/host-card"
import axios from "axios"
import { useAuth } from "@/context/authcontext"
import { API_SEARCH_RECOMMENDATION, API_SEARCH_ACOMMODATION, API_SEARCH_EVENTS, API_HOST_SEARCH_HOSTS, API_GET_USER } from "@/utils/endpoints/config"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getCookie } from "cookies-next"
import { useWebsocket } from "@/context/WebSocketContext"

interface Recommendation {
    id: string
    title: string
    description: string
    address: string
    city: string
    country: string
    createdAt: string
    rating: number
    category: number
    tags: string[]
    userId: string
    recommendationImages: {
      id: string
      url: string
      createdAt: string
      userId: string | null
      user: any | null
      recommendationId: string
    }[]
  }

  interface Acommodation {
    id: number
    title: string
    description: string
    addres: string
    city: string
    country: string
    pricePerMonth: number
    numberOfRooms: number
    bathrooms: number
    squareMeters: number
    hasWifi: boolean
    ownetId: string
    availableFrom: string
    availableTo: string
    images: string[]
    publisher: string
  }

  const categories = {
    Restaurant: 0,
    Cafeteria: 1,
    Museum: 2,
    LeisureZone: 3,
    Park: 4,
    HistoricalSite: 5,
    Shopping: 6,
    Bar: 7,
    Other: 8,
  } as const
  
  type CategoryName = keyof typeof categories
  type CategoryId = (typeof categories)[CategoryName]
  
  const categoryByNumber: Record<CategoryId, CategoryName> = Object.entries(categories).reduce(
    (acc, [name, id]) => {
      acc[id as CategoryId] = name as CategoryName
      return acc
    },
    {} as Record<CategoryId, CategoryName>
  )
  
  const getCategoryName = (categoryId: number): string => {
    return categoryByNumber[categoryId as CategoryId] || "Other"
  }
  
  const getCategoryIcon = (categoryId: number) => {
    const category = categoryByNumber[categoryId as CategoryId]?.toLowerCase() || ""
  
    switch (category) {
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "cafeteria":
        return <Coffee className="h-4 w-4" />
      case "museum":
        return <Landmark className="h-4 w-4" />
      case "leisurezone":
        return <Music className="h-4 w-4" />
      case "park":
        return <Bike className="h-4 w-4" />
      case "historicalsite":
        return <GraduationCap className="h-4 w-4" />
      case "shopping":
        return <Grid3X3 className="h-4 w-4" />
      case "bar":
        return <Coffee className="h-4 w-4" />
      default:
        return <Map className="h-4 w-4" />
    }
  }

export default function DashboardPage() {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    // const [acomodations, setAcomodations] = useState<Acommodation[]>([])
    const [acommodations, setAcommodations] = useState<Acommodation[]>([])
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
    const [dashboardHosts, setDashboardHosts] = useState<any[]>([])
    const [notifications, setNotifications] = useState<
  { message: string; timestamp: number; type: "message" | "event" | "group" | "recommendation" | "system" }[]
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("notifications")
        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    }
    return []
  })

    

    const { lastMessage } = useWebsocket()

    useEffect(() => {
      try {
        localStorage.setItem("notifications", JSON.stringify(notifications))
      } catch (e) {
        console.error("Error saving notifications to localStorage", e)
      }
    }, [notifications]) 
    

    useEffect(() => {
      const fetchSenderNameAndNotify = async (senderId: string, content: string) => {
        try {
          const token = getCookie("token")
          const response = await axios.get(API_GET_USER(senderId), {
            headers: { Authorization: `Bearer ${token}` }
          })
          const sender = response.data
          const fullName = `${sender.name}`
    
          setNotifications((prev) => [
            ...prev,
            {
              message: `${fullName} te ha enviado un mensaje: "${content}"`,
              timestamp: Date.now(),
              type: "message"
            }
          ])
        } catch (err) {
          console.error("Error fetching sender name:", err)
          setNotifications((prev) => [
            ...prev,
            {
              message: `Alguien te ha enviado un mensaje: "${content}"`,
              timestamp: Date.now(),
              type: "message"
            }
          ])
        }
      }
    
      if (lastMessage?.action === "notification" && lastMessage?.success && lastMessage?.message) {
        setNotifications((prev) => [
          ...prev,
          {
            message: lastMessage.message,
            timestamp: Date.now(),
            type: "system"
          }
        ])
      }
    
      if (lastMessage?.action === "new_message" && lastMessage?.content && lastMessage?.senderId) {
        fetchSenderNameAndNotify(lastMessage.senderId, lastMessage.content)
      }
    }, [lastMessage])
    
    

    interface Event {
      id: string
      title: string
      description: string
      location: string
      date: string
      category: string
      tags: string[]
      attendeesCount: number
      joined: boolean
    }
    
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
      const loadDashboardData = async () => {
        setIsLoadingDashboard(true)
        await Promise.all([getRecommendations(), fetchEvents(), searchAcommodations(), fetchDashboardHosts()])
        setIsLoadingDashboard(false)
      }
    
      if (user?.city && user?.erasmusCountry) {
        loadDashboardData()
      }
    }, [user])
    
    const fetchDashboardHosts = async () => {
      try {
        const token = getCookie("token")
        const response = await axios.post(
          API_HOST_SEARCH_HOSTS,
          {
            query: "",
            country: user?.erasmusCountry || "",
            city: user?.city || "",
            page: 1,
            limit: 4,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = response.data.items
        console.log("Hosts encontrados:", data)
        setDashboardHosts(data || [])
      } catch (error) {
        console.error("Error fetching dashboard hosts:", error)
        setDashboardHosts([])
      }
    }
    

    const fetchEvents = async () => {
      try {
        const token = getCookie("token")
        const response = await axios.post(
          API_SEARCH_EVENTS,
          {
            page: 1,
            limit: 4,
            query: "",
            location: "",
            category: "",
            tags: [],
            sortField: "",
            sortOrder: "",
            country: user?.erasmusCountry || "",
            city: user?.city || "",
            currentUserId: user?.id || ""
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log("Eventos encontrados:", response.data.items)
        setEvents(response.data.items || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      }
    }
    
    useEffect(() => {
      if (user?.city) {
        fetchEvents()
        fetchDashboardHosts()
      }
    }, [user])
    

    const getRecommendations = async () => {
        try {
          const token = getCookie("token")

          const body = {
            query: "",
            sortField: "",
            sortOrder: "",
            country: user?.erasmusCountry,
            city: user?.city,
            page: 1,
            limit: 4,
          }

          console.log("Body de la busqueda:", body)
  
          const response = await axios.post(API_SEARCH_RECOMMENDATION, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      
          const data = response.data.items
          console.log("Recomendaciones encontradas:", data)
      
          if (Array.isArray(data)) {
            setRecommendations(data)
          } else if (Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations)
          } else {
            setRecommendations([])
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error)
          setRecommendations([])
        }
    }

    const searchAcommodations = async () => {
      console.log("Buscando acomodaciones para:", user?.city, user?.erasmusCountry)
      try {
        const token = getCookie("token")
    
        const body = {
          query: "",
          sortField: "",
          sortOrder: "",
          accommodationType: null,
          availableFrom: null,
          availableTo: null,
          country: user?.erasmusCountry,
          city: user?.city,
          page: 1,
          limit: 4,
        }

        console.log("Body de la busqueda:", body)
    
        const response = await axios.post(API_SEARCH_ACOMMODATION, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = response.data.items
        console.log("Acomodaciones encontradas:", data)
    
        if (Array.isArray(data)) {
          setAcommodations(data)
        } else if (Array.isArray(data.accommodations)) {
          setAcommodations(data.accommodations)
        } else {
          setAcommodations([])
        }
      } catch (error) {
        console.error("Error fetching accommodations:", error)
        setAcommodations([])
      }
    }
    

    useEffect(() => {
      if (user?.city && user?.erasmusCountry) {
        searchAcommodations()
      }
    }, [user])
    

    useEffect(() => {
        getRecommendations()
    }, [])
    
    console.log("User data:", user)

    return (
        <div className="min-h-screen ">
        <div className="container mx-auto">
            {/* Welcome Section */}
            <section className="mb-8">
            <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 bg-repeat"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, <span className="text-4xl text-accent">{user?.name}</span></h1>
                    {/* Cambiar a futuro Ciudad de Erasmus */}
                    <p className="text-white/80 mb-4">Bet your Erasmus journey in {user?.city} is going great!</p>
                    <div className="flex items-center space-x-4">
                    
                    <div className="h-10 border-l border-white/20"></div>
                    <div>
                        {/* Cambiar a futuro Ciudad de Erasmus y dias */}
                        <p className="text-sm text-white/70">Days in {user?.city}</p>
                        <p className="text-4xl font-bold text-accent">{user?.erasmusDate}</p>
                    </div>
                    </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col items-start gap-2 space-y-3 md:space-y-0 md:space-x-3">
                    <Link href="/dashboard/events">
                    <Button className="bg-[#B7F8C8] text-[#0E1E40] hover:bg-[#B7F8C8]/90 font-semibold">
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                    </Link>
                    <Link href="/dashboard/recommendations">
                    <Button variant="outline" className="bg-white/10 border-none text-white hover:bg-white/10">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        Explore The City
                    </Button>
                    </Link>
                    <Link href="/dashboard/findpeople">
                    <Button variant="outline" className="bg-white/10 border-none text-white hover:bg-white/10">
                        <UsersIcon className="mr-2 h-4 w-4" />
                        Make New Friends
                    </Button>
                    </Link>
                </div>
                </div>
            </div>
            </section>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Upcoming Events */}
                <Card className="border-none shadow-sm bg-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                    <CardTitle className="text-xl text-text">Upcoming Events</CardTitle>
                    <CardDescription className="text-text-secondary">Events you&apos;ve joined or might be interested in</CardDescription>
                    </div>
                    <Link href="dashboard/events">
                    <Button variant="ghost" className="dark:text-text-secondary">
                    View all <ChevronRightIcon className="ml-1 h-4 w-4"/>
                    </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <CardContent>
                      <div className="space-y-4">
                        {events.length > 0 ? (
                          events.map((event) => (
                            <EventCard
                              key={event.id}
                              eventId={event.id}
                              title={event.title}
                              date={event.date}
                              location={event.location}
                              attendeesCount={event.attendeesCount}
                              category={event.category}
                              joined={event.joined}
                            />
                          ))
                        ) : (
                          <div className="text-center text-md text-text py-4">
                            <CalendarX className="mx-auto h-20 w-20 text-text-secondary mb-2" />
                            No events found in{" "}
                            <span className="font-semibold text-primary dark:text-text-secondary">{user?.city}</span>.
                          </div>
                        )}
                      </div>
                    </CardContent>


                    </div>
                </CardContent>
                
                </Card>

                {/* Housing */}
                <Card className="border-none shadow-sm bg-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2 text-text">
                    <div>
                    <CardTitle className="text-xl text-text">Housing</CardTitle>
                    <CardDescription className="text-text-secondary">Residences you might be interested in</CardDescription>
                    </div>
                    <Link href="/dashboard/housing">
                    <Button variant="ghost" className="dark:text-text-secondary">
                    View all <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                  {acommodations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {acommodations.map((acommodation) => (
                        <DashboardAcommodationCard key={acommodation.id} acommodation={acommodation} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-md text-text py-4">
                      <SearchX className="mx-auto h-20 w-20 text-text-secondary mb-2" />
                      No housing options available in{" "}
                      <span className="font-semibold text-primary dark:text-text-secondary">{user?.city}</span> at the moment.
                    </div>
                  )}
                </CardContent>

                </Card>

                {/* Local Recommendations */}
                <Card className="border-none shadow-sm bg-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                    <CardTitle className="text-xl text-text">Local Recommendations</CardTitle>
                    <CardDescription className="text-text-secondary">Places and activities recommended by hosts and other students</CardDescription>
                    </div>
                    <Link href="/dashboard/recommendations">
                        <Button variant="ghost" className="dark:text-text-secondary">
                        View all <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.map((recommendation) => (
                        <RecommendationCard
                          key={recommendation.id}
                          name={recommendation.title}
                          category={getCategoryName(recommendation.category)}
                          rating={recommendation.rating}
                          description={recommendation.description}
                          recommendedBy={recommendation.userId}
                          id={recommendation.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-md text-text py-4">
                      <CalendarX className="mx-auto h-20 w-20 text-text-secondary mb-2" />
                      No recommendations found in <span className="font-semibold text-primary dark:text-text-secondary">{user?.city}</span> yet. Be the first to recommend something!
                    </div>
                  )}
                </CardContent>

                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                {/* Notifications */}
                <Card className="border-none shadow-sm bg-foreground">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl text-text">Notifications</CardTitle>
                      <CardDescription className="text-text-secondary">Recent activities</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark:text-text-secondary"
                      onClick={() => {
                        setNotifications([])
                        localStorage.removeItem("notifications")
                      }}
                    >
                      Mark all as read
                    </Button>

                  </CardHeader>

                  <CardContent>
                    {notifications.length > 0 ? (
                      <div
                        className={`space-y-4 ${
                          notifications.length > 4 ? "max-h-80 overflow-y-auto pr-2" : ""
                        }`}
                      >
                        {notifications.map((notification, index) => (
                          <NotificationItem
                            key={index}
                            type={notification.type || "system"}
                            content={notification.message}
                            time={new Date(notification.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            read={false}
                          />
                        ))}

                      </div>
                    ) : (
                      <div className="text-center text-sm text-text py-4">
                        <BellIcon className="mx-auto h-10 w-10 text-text-secondary mb-4" />
                        You don’t have any notifications right now.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Your Hosts */}
                <Card className="border-none shadow-sm bg-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                    <CardTitle className="text-xl text-text">Your Hosts</CardTitle>
                    <CardDescription className="text-text-secondary">Local students helping you navigate your city</CardDescription>
                    </div>
                    <Link href="/dashboard/hosts">
                      <Button variant="ghost" size="sm" className="dark:text-text-secondary">
                        Find more
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                  {dashboardHosts.filter((host) => host.id !== user?.id).length > 0 ? (
                    <div className="space-y-4">
                      {dashboardHosts
                        .filter((host) => host.id !== user?.id)
                        .map((host) => (
                          <HostCard key={host.id} host={host} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-text py-4">
                      <UserX className="mx-auto h-10 w-10 text-text-secondary mb-4" />
                      No hosts available in{" "}
                      <span className="font-semibold text-primary dark:text-text-secondary">{user?.city}</span>{" "}
                      right now. If you're a host, go help someone!
                    </div>
                  )}
                </CardContent>

                </Card>
            </div>
            </div>
        </div>
        </div>
    )
}
