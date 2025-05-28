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
import { API_SEARCH_RECOMMENDATION, API_SEARCH_ACOMMODATION, API_ALL_ACOMMODATIONS } from "@/utils/endpoints/config"
import { useEffect, useState } from "react"
import Link from "next/link"

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

    const getRecommendations = async () => {
        try {
          const token = localStorage.getItem("token") // 👈 get token from storage

          const body = {
            query: "",
            sortField: "",
            sortOrder: "",
            country: "Spain",
            city: "",
            page: 1,
            limit: 4,
          }
  
          const response = await axios.post(API_SEARCH_RECOMMENDATION, body, {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 add Authorization header
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

    const fetchAcommodations = async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await axios.get(API_ALL_ACOMMODATIONS, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setAcommodations(Array.isArray(response.data) ? response.data : [])
        } catch (err) {
          console.error("Error fetching accommodations:", err)
          setAcommodations([])
        }
    }

    useEffect(() => {
        fetchAcommodations()
    }, [])

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
                    <Button className="bg-[#B7F8C8] text-[#0E1E40] hover:bg-[#B7F8C8]/90 font-semibold">
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-none text-white hover:bg-white/10">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        Explore The City
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-none text-white hover:bg-white/10">
                        <UsersIcon className="mr-2 h-4 w-4" />
                        Make New Friends
                    </Button>
                </div>
                </div>
            </div>
            </section>

            {/* Quick Stats */}
            {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-none shadow-sm bg-gradient-to-br from-foreground to-[#B7F8C8]/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-text-secondary">Upcoming Events</p>
                    <p className="text-2xl font-bold text-text">5</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#B7F8C8]/50 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-[#0E1E40]" />
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-gradient-to-br from-foreground to-[#4C69DD]/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-text-secondary">New Messages</p>
                    <p className="text-2xl font-bold text-text">12</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#4C69DD]/30 flex items-center justify-center">
                    <MessageCircleIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-gradient-to-br from-foreground to-[#62C3BA]/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-text-secondary">Group Invites</p>
                    <p className="text-2xl font-bold text-text">3</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#62C3BA]/40 flex items-center justify-center">
                    <Users2Icon className="h-5 w-5 text-[#0E1E40]" />
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-gradient-to-br from-foreground to-[#0E1E40]/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-text-secondary">New Recommendations</p>
                    <p className="text-2xl font-bold text-text">8</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0E1E40]/70 flex items-center justify-center">
                    <MapPinIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>
            </section> */}

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
                    <Button variant="ghost" className="dark:text-text-secondary">
                    View all <ChevronRightIcon className="ml-1 h-4 w-4"/>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <CardContent>
  <div className="space-y-4">
    <EventCard
      title="Language Exchange Night"
      date="Today, 7:00 PM"
      location="Café del Mar, Barcelona"
      attendees={18}
      category="Social"
      joined={true}
    />
    <EventCard
      title="Weekend Trip to Montserrat"
      date="Today, 9:00 AM"
      location="Plaça Catalunya"
      attendees={24}
      category="Trip"
      joined={true}
    />
    <EventCard
      title="International Food Festival"
      date="Tomorrow, 6:30 PM"
      location="University Campus"
      attendees={42}
      category="Cultural"
      joined={false}
    />
    <EventCard
      title="AI in Education: A Debate"
      date="Sunday, 10:00 AM"
      location="Tech Hub, Barcelona"
      attendees={16}
      category="Academic"
      joined={true}
    />
    <EventCard
      title="Sunset Beach Volleyball"
      date="Sunday, 6:00 PM"
      location="Barceloneta Beach"
      attendees={20}
      category="Sports"
      joined={true}
    />
    <EventCard
      title="Photography Workshop: City at Night"
      date="Sunday, 8:00 PM"
      location="Plaza Real"
      attendees={12}
      category="Workshop"
      joined={false}
    />
    <EventCard
      title="Neon Party at Apolo"
      date="Sunday, 11:00 PM"
      location="Sala Apolo, Barcelona"
      attendees={80}
      category="Party"
      joined={false}
    />
  </div>
</CardContent>

                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full bg-foreground border-primary-dark text-primary-dark hover:bg-primary hover:text-white">
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Create New Event
                    </Button>
                </CardFooter>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {acommodations.map((acommodation) => (
                        <DashboardAcommodationCard key={acommodation.id} acommodation={acommodation} />
                    ))}
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((recommendation) => (
                        <RecommendationCard key={recommendation.id} name={recommendation.title} category={getCategoryName(recommendation.category)} rating={recommendation.rating} description={recommendation.description} recommendedBy={recommendation.userId} />
                    ))}
                    </div>
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
                    <CardDescription className="text-text-secondary">Recent updates and activities</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="dark:text-text-secondary">
                    Mark all as read
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <NotificationItem
                        type="message"
                        content="Carlos sent you a message about the weekend trip"
                        time="10 minutes ago"
                        read={false}
                    />
                    <NotificationItem
                        type="event"
                        content="'Language Exchange Night' starts in 3 hours"
                        time="1 hour ago"
                        read={false}
                    />
                    <NotificationItem
                        type="recommendation"
                        content="Anna recommended 'Parc de la Ciutadella' to you"
                        time="2 days ago"
                        read={true}
                    />
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <Button variant="ghost" className="w-full dark:text-text-secondary">
                    View all notifications
                    </Button>
                </CardFooter>
                </Card>

                {/* Your Hosts */}
                <Card className="border-none shadow-sm bg-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                    <CardTitle className="text-xl text-text">Your Hosts</CardTitle>
                    <CardDescription className="text-text-secondary">Local students helping you navigate Barcelona</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="dark:text-text-secondary">
                    Find more
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <HostCard
                        name="Maria Rodriguez"
                        university="Universitat de Barcelona"
                        languages={["Spanish", "English", "Catalan"]}
                        lastActive="Online"
                    />
                    <HostCard
                        name="Jordi Puig"
                        university="Universitat Pompeu Fabra"
                        languages={["Spanish", "English", "French"]}
                        lastActive="2 hours ago"
                    />
                    <HostCard
                        name="Anna Costa"
                        university="Universitat Autònoma de Barcelona"
                        languages={["Spanish", "English", "Italian"]}
                        lastActive="Yesterday"
                    />
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
        </div>
    )
}
