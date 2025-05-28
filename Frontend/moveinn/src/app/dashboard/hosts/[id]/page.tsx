"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  MessageCircle,
  MapPin,
  Globe,
  GraduationCap,
  Clock,
  Users,
  Heart,
  Flag,
  ThumbsUp,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"

export default function HostProfilePage() {
  const params = useParams()
  const id = params?.id as string
  const [messageContent, setMessageContent] = useState("")

  // Sample host data
  const host = {
    id: id,
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=200&width=200",
    university: "Universitat de Barcelona",
    location: "Barcelona, Spain",
    languages: ["Spanish", "English", "Catalan"],
    rating: 4.9,
    reviewCount: 42,
    responseRate: 98,
    responseTime: "within 2 hours",
    expertise: ["Campus Life", "Housing", "Local Culture", "Academic Support", "Nightlife", "Weekend Trips"],
    bio: "Economics student at UB, born and raised in Barcelona. I love showing exchange students around the city and helping them navigate university life. I can help with course selection, finding accommodation, and introducing you to the best local spots!",
    isOnline: true,
    isSuperHost: true,
    joinedDate: "January 2023",
    helpedStudents: 37,
    availability: "Weekday evenings, weekends",
    interests: ["Photography", "Hiking", "Local Cuisine", "Cinema", "Music"],
    studyProgram: "Economics (3rd year)",
    hometown: "Barcelona, Spain",
    favoriteSpots: [
      "Bunkers del Carmel for the best sunset view of Barcelona",
      "El Born district for tapas and drinks",
      "Parc de la Ciutadella for studying outdoors",
      "MACBA area for skateboarding and street culture",
    ],
    hostingStyle:
      "I like to meet for coffee first to understand what you're looking for in Barcelona. I can then provide personalized recommendations and introduce you to my friends if you're interested in expanding your social circle. I'm also happy to help with practical matters like setting up a bank account or navigating the public transportation system.",
  }

  // Sample reviews
  const reviews = [
    {
      id: "1",
      author: {
        name: "Thomas Schmidt",
        avatar: "/placeholder.svg?height=60&width=60",
        university: "TU Munich",
      },
      rating: 5,
      date: "February 2025",
      content:
        "Maria was an amazing host! She helped me find affordable accommodation near the university and showed me all the best local spots. She was always quick to respond to my messages and went above and beyond to make me feel welcome in Barcelona. I highly recommend her to any Erasmus student coming to UB!",
    },
    {
      id: "2",
      author: {
        name: "Sophie Laurent",
        avatar: "/placeholder.svg?height=60&width=60",
        university: "Sciences Po Paris",
      },
      rating: 5,
      date: "December 2024",
      content:
        "I couldn't have asked for a better host for my semester in Barcelona. Maria helped me navigate the complicated course registration system at UB and introduced me to a great group of local and international students. She knows the city inside out and gave me excellent recommendations for places to eat, study, and hang out. Thank you, Maria!",
    },
    {
      id: "3",
      author: {
        name: "Marco Rossi",
        avatar: "/placeholder.svg?height=60&width=60",
        university: "University of Bologna",
      },
      rating: 4,
      date: "October 2024",
      content:
        "Maria was very helpful during my first weeks in Barcelona. She showed me around the campus and helped me understand the Spanish university system. She also gave me great tips for finding student discounts around the city. The only reason I'm not giving 5 stars is because she was sometimes busy with her own studies, but that's completely understandable!",
    },
  ]

  // Sample other hosts
  const otherHosts = [
    {
      id: "2",
      name: "Carlos Mendez",
      avatar: "/placeholder.svg?height=100&width=100",
      university: "Universitat Pompeu Fabra",
      location: "Barcelona, Spain",
      rating: 4.8,
      languages: ["Spanish", "English", "French"],
    },
    {
      id: "3",
      name: "Anna Costa",
      avatar: "/placeholder.svg?height=100&width=100",
      university: "Universitat Autònoma de Barcelona",
      location: "Barcelona, Spain",
      rating: 4.7,
      languages: ["Spanish", "English", "Italian"],
    },
    {
      id: "4",
      name: "Jordi Puig",
      avatar: "/placeholder.svg?height=100&width=100",
      university: "Universitat de Barcelona",
      location: "Barcelona, Spain",
      rating: 4.9,
      languages: ["Spanish", "English", "Catalan", "German"],
    },
  ]

  const handleMessageSubmit = () => {
    if (messageContent.trim()) {
      // In a real app, this would submit the message to the backend
      alert("Message sent: " + messageContent)
      setMessageContent("")
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard/hosts" className="text-[#4C69DD] hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Hosts
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 dark:text-text">{host.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Host Profile Header */}
            <Card className="border-none shadow-md mb-6 overflow-hidden bg-foreground py-0">
              <div className="bg-gradient-to-r from-[#4C69DD]/20 to-[#62C3BA]/20 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white">
                    <AvatarImage src={host.avatar} alt={host.name} />
                    <AvatarFallback className="bg-[#4C69DD] text-white text-3xl">{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {host.isOnline && (
                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                  )}
                  {host.isSuperHost && (
                    <Badge className="absolute top-0 right-0 bg-[#FFBF00] text-[#0E1E40]">
                      <Star className="h-3 w-3 mr-1 fill-[#0E1E40]" />
                      Super Host
                    </Badge>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-[#0E1E40] mb-1 dark:text-text">{host.name}</h1>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <div className="flex items-center justify-center md:justify-start">
                      <GraduationCap className="h-4 w-4 text-[#4C69DD] dark:text-text-secondary mr-1" />
                      <span className="text-gray-700 dark:text-gray-300 text-xs">{host.university}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="h-4 w-4 text-[#4C69DD] dark:text-text-secondary mr-1" />
                      <span className="text-gray-700 dark:text-gray-300 text-xs">{host.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                    {host.languages.map((language, index) => (
                      <Badge
                        key={language}
                        variant="outline"
                        className={`${
                          index === 0
                            ? "border-[#4C69DD] text-[#4C69DD] dark:border-text-secondary dark:text-text-secondary"
                            : index === 1
                              ? "border-[#62C3BA] text-[#62C3BA]"
                              : "border-accent text-accent"
                        }`}
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4">  
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="bg-[#4C69DD] hover:bg-[#4C69DD]/90 text-white">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Host
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-primary dark:text-text-secondary mb-2">About Me</h2>
                  <p className="text-gray-700 dark:text-gray-200">{host.bio}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-primary dark:text-text-secondary mb-2">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {host.expertise.map((area) => (
                      <Badge key={area} className="bg-[#E7ECF0] text-gray-600 dark:bg-background/50 dark:text-secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-primary dark:text-text-secondary mb-2">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {host.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="border-primary text-primary dark:text-accent dark:border-accent">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-primary dark:text-text-secondary mb-2">My Favorite Spots</h2>
                    <ul className="space-y-2">
                      {host.favoriteSpots.map((spot, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-[#FFBF00]/20 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <MapPin className="h-3 w-3 text-[#FFBF00]" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200">{spot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-primary dark:text-text-secondary mb-2">My Hosting Style</h2>
                    <p className="text-gray-700 dark:text-gray-200">{host.hostingStyle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-none shadow-md mb-6 bg-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary dark:text-text-secondary">Reviews</CardTitle>
                <CardDescription className="text-gray-400">What students say about {host.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-[#FFBF00] fill-[#FFBF00] mr-1" />
                    <span className="font-medium text-lg">{host.rating}</span>
                    <span className="text-gray-500 dark:text-gray-200 ml-1">({host.reviewCount} reviews)</span>
                  </div>

                  <Button variant="outline" className="text-white bg-primary">
                    Write a Review
                  </Button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 bg-background/50 text-gray-500 dark:text-gray-200">
                            <AvatarImage src={review.author.avatar} alt={review.author.name} />
                            <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-primary dark:text-secondary">{review.author.name}</div>
                            <div className="text-sm text-gray-500">{review.author.university}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#FFBF00] fill-[#FFBF00] mr-1" />
                          <span className="font-medium dark:text-accent">{review.rating}</span>
                          <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-text">{review.content}</p>
                      <div className="flex items-center mt-3 space-x-4">
                        <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                          <Flag className="mr-1 h-3 w-3" />
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {host.reviewCount > reviews.length && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="text-white bg-primary">
                      See All {host.reviewCount} Reviews
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="border-none shadow-md bg-foreground py-0 rounded-var(--radius-md)">
              <CardHeader className="bg-gradient-to-r from-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-t-[10px] text-white p-4">
                <CardTitle className="text-lg">Contact {host.name}</CardTitle>
                <CardDescription className="text-white/80">Send a message to start the conversation</CardDescription>
              </CardHeader>
              <CardContent className="p-4">

                <Textarea
                  placeholder={`Hi ${host.name}, I'm interested in connecting with you about my upcoming Erasmus semester in Barcelona...`}
                  className="min-h-32 mb-4 text-text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />

                <Button
                  className="w-full bg-[#4C69DD] text-white hover:bg-[#4C69DD]/70"
                  onClick={handleMessageSubmit}
                  disabled={!messageContent.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Host Details */}
            <Card className="border-none shadow-md bg-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary dark:text-text-secondary">Host Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1 dark:text-gray-300">Study Program</div>
                    <div className="font-medium text-[#0E1E40] dark:text-secondary">{host.studyProgram}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1 dark:text-gray-300">Hometown</div>
                    <div className="font-medium text-[#0E1E40] dark:text-secondary">{host.hometown}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1 dark:text-gray-300">Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {host.languages.map((language, index) => (
                        <Badge
                          key={language}
                          variant="outline"
                          className={`text-xs ${
                            index === 0
                              ? "border-[#4C69DD] text-[#4C69DD] dark:text-text-secondary dark:border-text-secondary"
                              : index === 1
                                ? "border-[#62C3BA] text-[#62C3BA]"
                                : "border-accent text-accent"
                          }`}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1 dark:text-gray-300">Member Since</div>
                    <div className="font-medium text-[#0E1E40] dark:text-secondary">{host.joinedDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
