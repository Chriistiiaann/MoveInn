import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, HomeIcon, MessageCircleIcon, Users2Icon, MapPinIcon, BookmarkIcon } from "lucide-react"
import FeatureCard from "@/components/landing/feature-card"
import TestimonialCard from "@/components/landing/testimonial-card"
import { HeroSection } from "@/components/landing/hero-section"
import { Navbar } from "@/components/landing/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-bacground to-foreground/30">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-16 px-4 md:px-8 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text dark:text-text">
              Connect, Explore, and Thrive Together
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              Our platform offers everything Erasmus students need to make the most of their experience abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<HomeIcon className="h-10 w-10 text-white" />}
              iconBg="bg-[#4C69DD]"
              title="Residence Groups"
              description="Create and join accommodation groups to find roommates and share housing tips."
            />
            <FeatureCard
              icon={<Users2Icon className="h-10 w-10 text-[#0E1E40]" />}
              iconBg="bg-[#B7F8C8]"
              title="Host Program"
              description="Connect with experienced students who can guide you through your Erasmus journey."
            />
            <FeatureCard
              icon={<CalendarIcon className="h-10 w-10 text-white" />}
              iconBg="bg-[#FFBF00]"
              title="Events & Meetups"
              description="Discover and join social gatherings, trips, and cultural activities."
            />
            <FeatureCard
              icon={<MessageCircleIcon className="h-10 w-10 text-white" />}
              iconBg="bg-[#0E1E40]"
              title="Host Chat"
              description="Get immediate assistance from hosts through our integrated chat system."
            />
            <FeatureCard
              icon={<BookmarkIcon className="h-10 w-10 text-[#0E1E40]" />}
              iconBg="bg-[#FFBF00]"
              title="Forums"
              description="Ask questions and share solutions on various topics with fellow students."
            />
            <FeatureCard
              icon={<MapPinIcon className="h-10 w-10 text-white" />}
              iconBg="bg-[#4C69DD]"
              title="Local Recommendations"
              description="Discover student-approved places and activities in your host city."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E7ECF0]/20 dark:bg-foreground/20 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F8C8]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0E1E40] dark:text-text">How It Works</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              Getting started is easy. Join our community in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-[#4C69DD]/5 dark:from-background dark:to-primary/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#4C69DD] dark:bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0E1E40] dark:text-text-secondary">Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign up and customize your student profile with your interests and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-[#FFBF00]/10 dark:from-background dark:to-accent/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFBF00] flex items-center justify-center text-white text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0E1E40] dark:text-text-secondary">Connect with Others</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Join residence groups, connect with hosts, and discover events in your area.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-[#62C3BA]/10 dark:from-background dark:to-secondary-greenblue/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#62C3BA] flex items-center justify-center text-[#0E1E40] text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0E1E40] dark:text-text-secondary">Enjoy Your Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Make the most of your Erasmus journey with new friends and local insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-16 px-4 md:px-8 bg-foreground">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0E1E40] dark:text-text">Explore Our Features</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Take a closer look at what our platform offers to enhance your Erasmus experience.
            </p>
          </div>

          <Tabs defaultValue="accommodations" className="w-full text-primary-dark">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8 bg-[#E7ECF0]/30 dark:bg-[#E7ECF0]/10 p-1 rounded-lg text-primary-dark">
              <TabsTrigger value="accommodations" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Accommodations
              </TabsTrigger>
              <TabsTrigger value="hosts" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Host Program
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Events
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Chat
              </TabsTrigger>
              <TabsTrigger value="forums" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Forums
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-white rounded-full text-text">
                Student Profiles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accommodations">
  <Card className="border-none shadow-md">
    <CardHeader>
      <CardTitle className="text-[#0E1E40] dark:text-accent">Student Residences</CardTitle>
      <CardDescription>
        Find housing options that fit your student lifestyle and budget.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Why Choose Our Residences:</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
              <span>Find available accommodations</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
              <span>Search by location, amenities, or available dates</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
              <span>Browse photos, prices, and room details easily</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
              <span>Book with confidence</span>
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-[#E7ECF0]/30 dark:from-secondary-greenblue/10 to-background/50 rounded-lg p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h4 className="font-medium text-[#0E1E40] dark:text-text">Barcelona Central Apartment</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">2 rooms • €650/month • Wi-Fi Included</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-[#62C3BA] text-[#0E1E40]">Near Campus</Badge>
            <Badge className="bg-[#62C3BA] text-[#0E1E40]">Fully Furnished</Badge>
            <Badge className="bg-[#62C3BA] text-[#0E1E40]">Wi-Fi</Badge>
          </div>
          <p className="text-sm mb-4">
            Cozy shared flat in the Eixample district, ideal for Erasmus students looking to live close to city life and university.
          </p>
          <Button className="w-full bg-[#4C69DD] hover:bg-[#4C69DD]/90">See More Options</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


            <TabsContent value="hosts">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0E1E40] dark:text-accent">Host Program</CardTitle>
                  <CardDescription>
                    Connect with experienced students who can guide you through your Erasmus journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Register as a host to help newcomers</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Find hosts based on language, university, or interests</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Get personalized guidance and local tips</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Earn recognition among the community</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-[#E7ECF0]/30 dark:from-secondary-greenblue/10 to-background/50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4 border-2 border-[#B7F8C8]">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Host" />
                          <AvatarFallback className="bg-[#4C69DD] text-white">MR</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-[#0E1E40] dark:text-text">Maria Rodriguez</h4>
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-[#62C3BA] text-[#0E1E40] dark:text-text">Host</Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Barcelona, Spain</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mb-4">
                        3rd year Economics student at UB. I can help with university registration, finding
                        accommodation, and showing you the best spots in Barcelona!
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-[#4C69DD] border-[#4C69DD]">
                          Spanish
                        </Badge>
                        <Badge variant="outline" className="text-[#62C3BA] border-[#62C3BA]">
                          English
                        </Badge>
                        <Badge variant="outline" className="text-[#0E1E40] border-[#0E1E40] dark:text-accent dark:border-accent">
                          Economics
                        </Badge>
                      </div>
                      <Button className="w-full bg-[#4C69DD] hover:bg-[#4C69DD]/90 text-white">Connect with Maria</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0E1E40] dark:text-accent">Events & Meetups</CardTitle>
                  <CardDescription>
                    Discover and join social gatherings, trips, and cultural activities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
                      <ul className="space-y-2">
                        {["Create and promote your own events", "Set fixed or open attendee limits", "Filter events by category, date, or location", "Receive notifications for upcoming events"].map((text, i) => (
                          <li key={i} className="flex items-start">
                            <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-[#4C69DD]/20 to-foreground dark:from-[#4C69DD]/20 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-[#0E1E40] dark:text-white">Weekend Trip to Porto</h4>
                          <Badge className="bg-primary text-white">Trip</Badge>
                        </div>
                        <p className="text-sm mb-2 dark:text-gray-300">
                          Join us for a weekend getaway to explore the beautiful city of Porto!
                        </p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CalendarIcon className="h-4 w-4 mr-1 dark:text-gray-200" />
                          <span>March 27, 2025</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-100 to-foreground dark:from-[#ffbfea]/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-[#0E1E40] dark:text-white">Language Exchange Night</h4>
                          <Badge className="bg-pink-200 text-pink-900">Social</Badge>
                        </div>
                        <p className="text-sm mb-2 dark:text-gray-300">
                          Practice languages with other international students in a fun, casual setting.
                        </p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-200 rounded-full" />
                          <span>Thursday, 7PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="chat">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0E1E40] dark:text-accent">Chat</CardTitle>
                  <CardDescription>
                    Get immediate assistance from hosts and other users through our integrated chat system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Real-time messaging with hosts</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Secure and private conversations</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Find hosts who are currently online</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                          <span>Fast and easy responses</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-md">
                      <div className="bg-gradient-to-r from-[#0E1E40] to-[#4C69DD] text-white p-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Host" />
                            <AvatarFallback className="bg-[#62C3BA] text-[#0E1E40]">JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jan Dvorak</p>
                            <p className="text-xs text-[#B7F8C8]">Host • Prague University</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 h-48 bg-gray-50 dark:bg-foreground flex flex-col">
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">You, 2:34 PM</p>
                          <div className="bg-secondary/50 rounded-lg p-2 text-sm inline-block dark:text-gray-100">
                            Hi Jan! I&apos;m arriving in Prague next week. Any tips for public transportation from the
                            airport?
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Jan, 2:36 PM</p>
                          <div className="bg-secondary-greenblue/50 rounded-lg p-2 text-sm inline-block dark:text-gray-100">
                            Welcome! The easiest way is to take Bus 119 to Nádraží Veleslavín and then the Metro line A
                            to the city center. I can meet you at the station if you&apos;d like!
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="w-full p-2 pr-10 border border-gray-200 rounded-md text-sm"
                            />
                            <Button size="sm" className="absolute right-1 top-1 h-6 w-6 p-0 bg-[#4C69DD]">
                              <MessageCircleIcon className="h-3 w-3 text-white" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forums">
  <Card className="border-none shadow-md">
    <CardHeader>
      <CardTitle className="text-[#0E1E40] dark:text-accent">Forums</CardTitle>
      <CardDescription className="dark:text-gray-300">
        Ask questions and share solutions on various topics with fellow students.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
          <ul className="space-y-2">
            {[
              "Topic-based discussion boards",
              "Upvote helpful answers",
              "Search for existing solutions",
              "Bookmark important threads",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {/* Forum Card 1 — Scholarships (index 3) */}
          <div className="bg-gradient-to-br from-purple-100 dark:from-[#ccb1ef]/50 to-foreground rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#0E1E40] dark:text-white">Scholarship Application Tips</h4>
              <Badge className="bg-purple-200 text-purple-900">Scholarships</Badge>
            </div>
            <p className="text-sm mb-2 dark:text-gray-300">
              Does anyone have advice on applying for the Erasmus+ scholarship? I&apos;m struggling with the
              motivation letter.
            </p>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>23 replies</span>
              <span>Last reply: 2 hours ago</span>
            </div>
          </div>

          {/* Forum Card 2 — University Life (index 1) */}
          <div className="bg-gradient-to-br from-yellow-100 dark:from-yellow-200/50 to-foreground rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#0E1E40] dark:text-white">Course Equivalence at Host Universities</h4>
              <Badge className="bg-yellow-200 text-yellow-900">University Life</Badge>
            </div>
            <p className="text-sm mb-2 dark:text-gray-300">
              How do I make sure my courses will be recognized when I return to my home university?
            </p>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>42 replies</span>
              <span>Last reply: Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


<TabsContent value="recommendations">
  <Card className="border-none shadow-md">
    <CardHeader>
      <CardTitle className="text-[#0E1E40] dark:text-accent">Local Recommendations</CardTitle>
      <CardDescription className="dark:text-gray-300">
        Discover student-approved places and activities in your host city.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
          <ul className="space-y-2">
            {[
              "Student-curated recommendations",
              "Filter by category (food, culture, nightlife)",
              "Budget-friendly options highlighted",
              "Add your own reviews and photos",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mr-2 mt-1 bg-[#B7F8C8] rounded-full p-1"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {/* Café Louvre — cafeteria */}
          <div className="bg-gradient-to-br from-pink-100 dark:from-[#ffbfea]/50 to-foreground rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#0E1E40] dark:text-white">Café Louvre, Prague</h4>
              <div className="flex">
                <Badge className="bg-pink-200 text-pink-900">Cafeteria</Badge>
              </div>
            </div>
            <p className="text-sm mb-2 dark:text-gray-300">
              Historic café with great study spaces and affordable breakfast menu. Student discount available!
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>Národní 22, Prague 1</span>
            </div>
          </div>

          {/* Retiro Park — park */}
          <div className="bg-gradient-to-br from-green-100 dark:from-secondary-greenblue/30 to-foreground rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#0E1E40] dark:text-white">Retiro Park, Madrid</h4>
              <div className="flex">
                <Badge className="bg-secondary-greenblue text-green-900">Park</Badge>
              </div>
            </div>
            <p className="text-sm mb-2 dark:text-gray-300">
              Perfect place for picnics, studying outdoors, or renting a rowboat on the lake.
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>Plaza de la Independencia, Madrid</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="profiles">
  <Card className="border-none shadow-md">
    <CardHeader>
      <CardTitle className="text-[#0E1E40] dark:text-accent">Student Profiles</CardTitle>
      <CardDescription className="dark:text-gray-300">
        Connect with other Erasmus students based on shared interests and goals.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#0E1E40] dark:text-text-secondary">Key Features:</h3>
          <ul className="space-y-2">
            {[
              "Customizable student profiles",
              "Highlight your interests and skills",
              "Connect with students with similar interests",
              "Showcase your Erasmus achievements",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mr-2 mt-1 bg-secondary rounded-full p-1"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-secondary-greenblue/20 to-foreground/10 dark:from-secondary-greenblue/10 rounded-lg p-6">
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-20 w-20 mb-4 border-2 border-secondary">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Student" />
              <AvatarFallback className="bg-primary text-white">TS</AvatarFallback>
            </Avatar>
            <h4 className="font-medium text-[#0E1E40] dark:text-white text-xl">Thomas Schmidt</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Berlin → Lisbon</p>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-[#0E1E40] dark:text-white mb-2">About Me</h5>
            <p className="text-sm dark:text-gray-300">
              Computer Science student passionate about web development and photography. Looking to improve my Portuguese and explore the local culture!
            </p>
          </div>

          <div className="flex justify-between">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">Connect</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:from-[#0E1E40]/50 dark:via-[#4C69DD]/30 dark:to-foreground/30 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F8C8]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 bg-repeat"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Hear from Our Community</h2>
            <p className="text-lg max-w-3xl mx-auto text-white/80">
              See how our platform has enhanced the Erasmus experience for students across Europe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The host program connected me with a local student who showed me all the hidden gems in Barcelona. It made my transition so much easier!"
              name="Sophie Laurent"
              role="French student in Barcelona"
              avatarUrl="/placeholder.svg?height=64&width=64"
            />
            <TestimonialCard
              quote="Finding roommates was my biggest worry, but the residence groups feature helped me find the perfect apartment with amazing flatmates."
              name="Marco Rossi"
              role="Italian student in Berlin"
              avatarUrl="/placeholder.svg?height=64&width=64"
            />
            <TestimonialCard
              quote="The events feature helped me make friends from day one. I've participated in weekend trips, language exchanges, and cultural nights!"
              name="Anna Kowalski"
              role="Polish student in Lisbon"
              avatarUrl="/placeholder.svg?height=64&width=64"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E7ECF0]/30 via-foreground to-[#FFBF00]/10 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBF00]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4C69DD]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-accent">
            Ready to Enhance Your Erasmus Experience?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-[#0E1E40] dark:text-gray-300">
            Join thousands of students who are making the most of their time abroad with MoveInn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#0E1E40] px-8 py-6 text-lg font-bold">
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#0E1E40] to-[#4C69DD] dark:from-[#0E1E40]/50 dark:via-[#4C69DD]/30 dark:to-foreground/30 text-white py-12 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F8C8]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Move<span className="text-[#B7F8C8]">Inn</span>
              </h3>
              <p className="text-sm opacity-80 mb-4">
                Your all-in-one platform for making the most of your Erasmus experience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Residence Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Host Program
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Events & Meetups
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Host Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Forums
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Erasmus+ Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    University Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B7F8C8] transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-60">
            <p>© 2025 MoveInn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

