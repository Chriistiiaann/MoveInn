"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Search,
  MapPin,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Flag from 'react-world-flags'
import axios from "axios"
import { API_ALL_FORUMS, API_BASE_IMAGE_URL, API_FORUM_POST_FORUM, API_FORUM_SEARCH_FORUMS, API_FORUM_COUNTRIES } from "@/utils/endpoints/config"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authcontext"
import { motion, AnimatePresence } from 'framer-motion'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
countries.registerLocale(enLocale)
import { toast } from "sonner"
import { ForumCard } from "@/components/forums/detailed-forum-card"


const categoryLabels: Record<number, string> = {
  0: "Procedures & Docs",
  1: "University Life",
  2: "Cultural & Social",
  3: "Scholarships",
  4: "Transport",
  5: "Tourism & Nightlife",
  6: "Events",
  7: "Tips",
  8: "FAQ",
  9: "Other"
}

const forumCategoryColors: Record<number, string> = {
  0: "from-[#B7F8C8]/30 to-foreground",
  1: "from-yellow-100 dark:from-yellow-200/50 to-foreground",
  2: "from-pink-100 dark:from-[#ffbfea]/50 to-foreground",
  3: "from-purple-100 dark:from-[#ccb1ef]/50 to-foreground",
  4: "from-green-100 dark:from-secondary-greenblue/30 to-foreground",
  5: "from-amber-200 dark:from-[#723917]/50 to-foreground",
  6: "from-[#0E1E40]/30 dark:from-[#0E1E40]/50 to-foreground",
  7: "from-[#4C69DD]/20 to-foreground",
  8: "from-gray-200 dark:from-gray-400/20 to-foreground",
  9: "from-gray-200 dark:from-gray-400/20 to-foreground",
}

const forumCategoryBadgeColors: Record<number, string> = {
  0: "bg-secondary text-green-900",
  1: "bg-yellow-200 text-yellow-900",
  2: "bg-pink-200 text-pink-900",
  3: "bg-purple-200 text-purple-900",
  4: "bg-secondary-greenblue text-green-900",
  5: "bg-amber-400 text-amber-900",
  6: "bg-[#0E1E40] text-white",
  7: "bg-primary text-white",
  8: "bg-gray-300 text-gray-800",
  9: "bg-gray-200 text-gray-700",
}

const forumCategoryBorderColors: Record<number, string> = {
  0: "border-secondary",
  1: "border-yellow-200",
  2: "border-pink-200",
  3: "border-purple-200",
  4: "border-secondary-greenblue",
  5: "border-amber-400",
  6: "border-[#0E1E40]",
  7: "border-primary",
  8: "border-gray-300",
  9: "border-gray-200",
}

export interface Forum {
  id: string
  title: string
  description: string
  country: string
  category: number
  createdAt: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
}

export default function ForumsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [forums, setForums] = useState<Forum[]>([])
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [newForumCategory, setNewForumCategory] = useState<number>(0);
  const [isCreatingForum, setIsCreatingForum] = useState(false);
  const [showCreateForum, setShowCreateForum] = useState(false)
  const [countrySearch, setCountrySearch] = useState('');
  const [page, setPage] = useState(0)
  const [totalForums, setTotalForums] = useState(0)
  const limit = 5
  const [forumCountries, setForumCountries] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingForums, setIsLoadingForums] = useState(false)



  const { user } = useAuth()

  const getForums = async () => {
    try {
      setIsLoadingForums(true)
      const token = localStorage.getItem("token")
      const response = await axios.post(API_FORUM_SEARCH_FORUMS, {
        page: page + 1,
        limit,
        query: searchTerm.trim(),
        country: activeFilter ?? "",
        category: activeCategory !== null ? activeCategory : null,
        sortField: "createdAt",
        sortOrder: "desc"
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })      

      console.log(response.data)
  
      setForums(Array.isArray(response.data?.items) ? response.data.items : [])
      setTotalForums(response.data?.totalItems || 0)
    } catch (error) {
      console.error("Error fetching forums", error)
      setForums([])
    }
    finally {
      setIsLoadingForums(false)
    }
  }

  const loadForumCountries = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(API_FORUM_COUNTRIES, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForumCountries(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error loading countries:", error)
      setForumCountries([])
    }
  }
  

  const getCountryCode = (countryName: string) => {
    return countries.getAlpha2Code(countryName, 'en') || "UN"
  }
  
  const filteredCountries = forumCountries
  .filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))
  .map(name => ({
    name,
    code: getCountryCode(name),
  }))
  .filter(c => c.code !== "UN")


    const handleCreateForum = async () => {
      if (!newForumTitle.trim() || !newForumDescription.trim()) {
        toast.error("Please fill in both title and description.")
        return
      }
    
      try {
        setIsCreatingForum(true)
        const token = localStorage.getItem("token")
    
        const payload = {
          title: newForumTitle,
          description: newForumDescription,
          country: user?.erasmusCountry,
          category: newForumCategory,
          createdAt: new Date().toISOString(),
          creatorId: user?.id
        }
    
        await axios.post(API_FORUM_POST_FORUM, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
    
        toast.success("Forum created successfully!")
    
        setNewForumTitle('')
        setNewForumDescription('')
        setNewForumCategory(9)
        getForums()
      } catch (err: any) {
        console.error("Error creating forum:", err)
        toast.error("Failed to create forum.")
      } finally {
        setIsCreatingForum(false)
      }
    }

    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const token = localStorage.getItem("token")
          const res = await axios.get(API_FORUM_COUNTRIES, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setForumCountries(res.data || [])
          console.log("Loaded forum countries:", res.data)
        } catch (err) {
          console.error("Error fetching forum countries", err)
        }
      }
    
      fetchCountries()
    }, [])
    

  useEffect(() => { getForums(); loadForumCountries() }, [page,activeFilter, activeCategory, searchTerm])
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Community Forums</h1>
                  <p className="text-white/80">Connect with fellow Erasmus students, ask questions, and share your experiences.</p>
                </div>
                <Button
                  className="bg-[#FFBF00] text-[#0E1E40] hover:bg-[#FFBF00]/90 mt-4 md:mt-0 cursor-pointer"
                  onClick={() => setShowCreateForum(prev => !prev)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showCreateForum ? "Close Form" : "Create New Topic"}
                </Button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                placeholder="Search forums..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(0)
                }}
                className="pl-10 bg-white/10 text-white placeholder:text-white/60 border-white/20 focus:bg-white/20"
              />

              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="space-y-6 order-2 xl:order-1 xl:col-span-1">
            <Card className="border-none shadow-md bg-foreground border border-gray-200">
              <CardContent className="px-4">
              <h2 className="font-semibold text-text-secondary mb-3">Countries</h2>

<Input
  placeholder="Search countries..."
  value={countrySearch}
  onChange={(e) => setCountrySearch(e.target.value)}
  className="mb-3 dark:text-gray-400 dark:border-text-secondary border-primary text-gray-700"
/>

<div className={`space-y-2 ${filteredCountries.length > 10 ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
{filteredCountries.map((country) => (
  <Button
    key={country.name}
    variant="outline"
    className={`w-full justify-between h-auto py-2 border-none text-primary-dark ${activeFilter === country.name ? "bg-[#4C69DD]/20" : ""} cursor-pointer`}
    onClick={() => {
      const newFilter = activeFilter === country.name ? null : country.name
      setActiveFilter(newFilter)
      setPage(0)
    }}
  >
    <div className="flex items-center">
      <Flag code={country.code} style={{ width: 24, height: 16 }} />
      <span className="ml-2"> {country.name}</span>
    </div>
  </Button>
))}

</div>

              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-foreground">
              <CardContent className="px-4">
                <h2 className="font-semibold text-text-secondary mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryLabels).map(([id, label]) => (
                    <Badge
                    key={id}
                    onClick={() => {
                      const newCategory = activeCategory === Number(id) ? null : Number(id)
                      setActiveCategory(newCategory)
                      setPage(0) // 👈 esto reinicia la paginación al cambiar de categoría
                    }}
                    className={`cursor-pointer px-3 py-1 rounded-md text-xs font-medium ${forumCategoryBadgeColors[Number(id)]} ${activeCategory === Number(id) ? "ring-2 ring-offset-2 ring-[#0E1E40]" : ""}`}
                  >
                    {label}
                  </Badge>
                  
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 xl:order-2 xl:col-span-3">
            {(activeFilter || activeCategory !== null) && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                {activeFilter && (
                  <Badge className="bg-[#4C69DD]/10 text-[#4C69DD] dark:bg-text-secondary/10 dark:text-text-secondary hover:bg-[#4C69DD]/20 px-3 py-1" onClick={() => setActiveFilter(null)}>
                    {activeFilter}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {activeCategory !== null && (
                  <Badge className="bg-[#4C69DD]/10 text-[#4C69DD] dark:bg-text-secondary/10 dark:text-text-secondary hover:bg-[#4C69DD]/20 px-3 py-1" onClick={() => setActiveCategory(null)}>
                    {categoryLabels[activeCategory]}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            <div
              className={`
                flex items-center justify-between cursor-pointer
                rounded-lg px-4 py-3 mb-4 transition-colors duration-200
                bg-gradient-to-r from-accent-light dark:from-accent/70 to-foreground
                hover:bg-accent/80 hover:bg-none
                border border-dashed border-accent
              `}
              onClick={() => setShowCreateForum(prev => !prev)}
            >
              <div className="flex items-center gap-2">
                {showCreateForum ? (
                  <ChevronUp className="h-4 w-4 text-text" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-text" />
                )}
                <span className="text-sm font-medium text-text">
                  {showCreateForum ? "Hide Forum Form" : "Create Forum Post"}
                </span>
              </div>
              <span className="text-xs text-text">{user?.erasmusCountry || "Your country"}</span>
            </div>

            <AnimatePresence>
              {showCreateForum && (
                <motion.div
                  key="forumForm"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border border-primary rounded-xl shadow p-6 mb-8 bg-foreground">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-text">Start a New Forum</h2>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{user?.erasmusCountry || "Unknown"}</span>
                      </div>
                    </div>

                    <Input
                      value={newForumTitle}
                      onChange={(e) => setNewForumTitle(e.target.value)}
                      placeholder="Forum Title"
                      className="mb-4 placeholder:text-gray-500 text-primary-dark text-sm border border-[#4C69DD] focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
                    />

                    <textarea
                      value={newForumDescription}
                      onChange={(e) => setNewForumDescription(e.target.value)}
                      placeholder="What's this forum about?"
                      rows={4}
                      className="w-full mb-4 rounded-md border border-[#4C69DD] placeholder:text-gray-500 text-primary-dark text-sm p-3 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none resize-none"
                    />

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                      <div className={`inline-block mb-2 px-3 py-1 text-xs rounded-md font-medium ${forumCategoryBadgeColors[newForumCategory]}`}>
                        {categoryLabels[newForumCategory]}
                      </div>
                      <select
                        value={newForumCategory}
                        onChange={(e) => setNewForumCategory(Number(e.target.value))}
                        className="w-full rounded-md border border-[#4C69DD] bg-foreground text-primary-dark text-sm p-2 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      onClick={handleCreateForum}
                      disabled={isCreatingForum}
                      className="bg-[#4C69DD] hover:bg-[#3b5ccd] text-white cursor-pointer"
                    >
                      {isCreatingForum ? "Posting..." : "Post Forum"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 w-full">
  {isLoadingForums ? (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  ) : (
    forums.map((forum) => (
      <ForumCard
        key={forum.id}
        forum={forum}
        categoryLabels={categoryLabels}
        categoryBadgeColors={forumCategoryBadgeColors}
        categoryBorderColors={forumCategoryBorderColors}
        categoryBgColors={forumCategoryColors}
      />
    ))
  )}
</div>


            {totalForums > limit && (
  <div className="mt-6 flex justify-center gap-2 flex-wrap">
    {Array.from({ length: Math.ceil(totalForums / limit) }, (_, i) => (
      <Button
        key={i}
        onClick={() => setPage(i)}
        variant={i === page ? "default" : "outline"}
        className={`border-primary dark:border-text-secondary text-primary dark:text-text-secondary min-w-[36px] h-9 px-3 py-1 text-sm ${i === page ? "bg-[#4C69DD] text-white" : ""}`}
      >
        {i + 1}
      </Button>
    ))}
  </div>
)}



{forums.length === 0 && (
  <div className="text-center py-12">
    <h3 className="text-xl font-medium text-text mb-2">No forums found</h3>
    <p className="text-text-secondary mb-6">Try adjusting your search or filters.</p>
    <Button className="text-white" onClick={() => { setActiveFilter(null); setActiveCategory(null); }}>
      Clear Filters
    </Button>
  </div>
)}

          </div>
        </div>
      </main>
    </div>
  )
}