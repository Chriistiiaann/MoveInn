"use client"

import { useEffect, useState } from "react"
import {
  Search,
  MapPin,
  Coffee,
  Utensils,
  Landmark,
  Music,
  GraduationCap,
  Bike,
  Map,
  Grid3X3,
  Plus,
  X, 
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { API_CREATE_RECOMMENDATION, API_RECOMMENDATION_CITIES, API_RECOMMENDATION_COUNTRIES, API_SEARCH_RECOMMENDATION } from "@/utils/endpoints/config"
import { DetailedRecommendationCard } from "@/components/recommendations/detailed-recommendation-card"
import { Recommendation, categories } from "@/types/recommendation"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/context/authcontext"
import { toast } from "sonner"
import Flag from 'react-world-flags'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import Link from "next/link"
import { CountrySearch, CitySearch } from "@/components/ui/country-city-search"

countries.registerLocale(enLocale)


type CategoryName = keyof typeof categories
type CategoryId = (typeof categories)[CategoryName]

const categoryByNumber: Record<CategoryId, CategoryName> = Object.entries(categories).reduce(
  (acc, [name, id]) => {
    acc[id as CategoryId] = name as CategoryName
    return acc
  },
  {} as Record<CategoryId, CategoryName>
)

export const getCategoryIcon = (categoryId: number) => {
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

const getCategoryName = (categoryId: number): string => {
  return categoryByNumber[categoryId as CategoryId] || "Other"
}

const getCountryCode = (countryName: string) => {
  return countries.getAlpha2Code(countryName, 'en') || 'UN'
}



export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: 0,
    tags: "",
    address: "",
    city: "",
    country: "",
    rating: 0,
    files: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(6)

  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [countrySearch, setCountrySearch] = useState("")
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")


  const { user } = useAuth()

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, files: Array.from(files) }))
    }
  }
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.address.trim() ||
        !formData.country.trim() ||
        !formData.city.trim() ||
        !formData.category ||
        tags.length === 0 ||
        formData.files.length === 0 ||
        !user?.id ||
        formData.rating < 1 ||
        formData.rating > 5
      ) {
        toast.error("Please fill in all required fields and add at least one tag.")
        setIsSubmitting(false)
        return
      }
  
      const token = localStorage.getItem("token")
      const multipart = new FormData()
  
      multipart.append("Title", formData.title)
      multipart.append("Description", formData.description)
      multipart.append("Category", String(formData.category))
  
      tags.forEach(tag => multipart.append("Tags", tag))

  
      multipart.append("Address", formData.address)
      multipart.append("City", formData.city)
      multipart.append("Country", formData.country)
      multipart.append("Rating", String(formData.rating))
      multipart.append("UserId", user.id)
  
      formData.files.forEach((file) => multipart.append("Files", file))
  
      await axios.post(API_CREATE_RECOMMENDATION, multipart, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
  
      toast.success("Recommendation created successfully!")
      await fetchRecommendations()
  
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: 0,
        tags: "",
        address: "",
        city: "",
        country: "",
        rating: 0,
        files: [],
      })
      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating recommendation:", error)
      toast.error("Failed to create recommendation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(API_RECOMMENDATION_COUNTRIES, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAvailableCountries(res.data)
    } catch (err) {
      console.error("Error fetching countries:", err)
    }
  }
  
  const fetchCities = async (country: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(API_RECOMMENDATION_CITIES(country), {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAvailableCities(res.data)
    } catch (err) {
      console.error("Error fetching cities:", err)
      setAvailableCities([])
    }
  }

  useEffect(() => {
    if (selectedCountry) {
      fetchCities(selectedCountry)
      setSelectedCity("")
    } else {
      setAvailableCities([])
    }
  }, [selectedCountry])
  
  
  
  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(API_SEARCH_RECOMMENDATION, {
        query: searchQuery,
        sortField: "",
        sortOrder: "",
        country: selectedCountry,
        city: selectedCity,
        category: selectedCategory ? categories[selectedCategory as CategoryName] : null,
        page: currentPage,
        limit: limit,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
  
      const data = Array.isArray(response.data.items)
        ? response.data.items
        : response.data.recommendations ?? []
  
      setRecommendations(data)
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setRecommendations([])
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [searchQuery, selectedCountry, selectedCity, selectedCategory, currentPage])  

  useEffect(() => {
    fetchRecommendations()
    fetchCountries()
  }, [])

  const uniqueCountries = Array.from(new Set(recommendations.map((r) => r.country).filter(Boolean)))
  const citiesByCountry: Record<string, string[]> = {}
  recommendations.forEach((r) => {
    if (r.country && r.city) {
      if (!citiesByCountry[r.country]) {
        citiesByCountry[r.country] = []
      }
      if (!citiesByCountry[r.country].includes(r.city)) {
        citiesByCountry[r.country].push(r.city)
      }
    }
  })

  const currentCities = selectedCountry ? citiesByCountry[selectedCountry] || [] : []

  const filtered = recommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCountry = selectedCountry ? rec.country === selectedCountry : true
    const matchesCity = selectedCity ? rec.city === selectedCity : true
    const matchesCategory = selectedCategory
      ? getCategoryName(rec.category).toLowerCase() === selectedCategory.toLowerCase()
      : true

    return matchesSearch && matchesCountry && matchesCity && matchesCategory
  })

  return (
    <div className="min-h-screen px-4 py-6 container mx-auto">
      <section className="mb-8">
  <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 text-white relative">
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Local Recommendations</h1>
          <p className="text-white/80">Discover great places recommended by students and hosts</p>
        </div>
        <Button
  onClick={() => setShowCreateForm(prev => !prev)}
  className="bg-[#B7F8C8] text-[#0E1E40] hover:bg-[#B7F8C8]/90 mt-4 md:mt-0"
>
  {showCreateForm ? (
    <>
      <X className="mr-2 h-4 w-4" />
      Close Form
    </>
  ) : (
    <>
      <Plus className="mr-2 h-4 w-4" />
      Add Recommendation
    </>
  )}
</Button>

      </div>
      <div className="relative flex">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search places..."
          className="pl-10 bg-white/10 text-white placeholder:text-white/60"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  </div>
</section>

<div
  className="mt-6 mb-4 flex items-center justify-between cursor-pointer rounded-lg px-4 py-3 bg-gradient-to-r from-accent-light dark:from-accent/70 to-foreground hover:bg-accent/80 border border-dashed border-accent"
  onClick={() => setShowCreateForm(prev => !prev)}
>
  <div className="flex items-center gap-2 text-text">
    {showCreateForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    <span className="font-medium">{showCreateForm ? "Hide Form" : "Create Recommendation"}</span>
  </div>
</div>

<AnimatePresence>
  {showCreateForm && (
    <motion.div
      key="createForm"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border border-primary rounded-xl shadow p-6 mb-8 bg-foreground">
        <h2 className="text-xl font-bold text-text mb-4">Create a New Recommendation</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            { label: "Title", name: "title", placeholder: "e.g. Chill place with good food" },
            { label: "Address", name: "address", placeholder: "e.g. Calle de la Paz 14" },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
              <Input
                name={name}
                value={(formData as any)[name]}
                onChange={handleFormChange}
                placeholder={placeholder}
                className="text-primary-dark text-sm border border-[#4C69DD] focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
              />
            </div>
          ))}

<div>
  <label className="block text-sm font-medium text-text-secondary mb-1">Tags (up to 3)</label>
  <Input
    placeholder="Add a tag and press Enter"
    value={tagInput}
    onChange={(e) => setTagInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const trimmed = tagInput.trim()
        if (trimmed && !tags.includes(trimmed) && tags.length < 3) {
          setTags([...tags, trimmed])
          setTagInput("")
        }
      }
    }}
    disabled={tags.length >= 3}
    className={`text-primary-dark text-sm border ${
      tags.length >= 3 ? "opacity-50 cursor-not-allowed" : "border-[#4C69DD]"
    } focus:ring-2 focus:ring-[#4C69DD] focus:outline-none`}
  />

  {/* Lista de tags */}
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag) => (
      <Badge
        key={tag}
        variant="outline"
        className="text-xs py-1 px-2 flex items-center gap-1 bg-muted text-text"
      >
        {tag}
        <button
          type="button"
          onClick={() => setTags(tags.filter((t) => t !== tag))}
          className="ml-1 hover:text-red-500"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ))}
  </div>

  {tags.length >= 3 && (
    <p className="text-xs text-red-500 mt-1">You can only add up to 3 tags.</p>
  )}
</div>


          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Rating (1–5)</label>
            <Input
              name="rating"
              type="number"
              min={1}
              max={5}
              value={formData.rating}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 1 && value <= 5) {
                  setFormData(prev => ({ ...prev, rating: value }))
                }
              }}
              placeholder="1 to 5"
              className="text-primary-dark text-sm border border-[#4C69DD] focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
            <CountrySearch
              value={formData.country}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  country: val,
                  city: "", // reset city if country changes
                }))
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
            <CitySearch
              value={formData.city}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  city: val,
                }))
              }
              country={formData.country}
            />
          </div>

        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            className="w-full rounded-md border border-[#4C69DD] bg-foreground text-primary-dark text-sm p-2 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
          >
            {Object.entries(categories).map(([name, id]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
            placeholder="Describe the place and why you're recommending it..."
            className="w-full rounded-md border border-[#4C69DD] placeholder:text-gray-500 text-primary-dark text-sm p-3 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-1">Upload Images</label>
          <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, files: Array.from(files) }))
    }
  }}
  className="w-full rounded-md border border-[#4C69DD] text-primary-dark text-sm p-2 bg-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#4C69DD] file:text-white hover:file:bg-[#3b5ccd]"
/>


          {formData.files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.files.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-28 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#4C69DD] hover:bg-[#3b5ccd] text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Recommendation"}
        </Button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

<section className="mb-6">
  <div className="bg-foreground p-4 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-2 text-text">Filter by Country</h2>

    <Input
      placeholder="Search countries..."
      value={countrySearch}
      onChange={(e) => setCountrySearch(e.target.value)}
      className="mb-4 text-sm border-primary dark:border-text-secondary text-text"
    />

    <div className={`flex flex-wrap gap-2 ${availableCountries.length > 12 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
      {availableCountries
        .filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))
        .map(name => {
          const code = getCountryCode(name)
          if (code === "UN") return null // evita países sin código válido

          return (
            <Button
              key={name}
              variant="outline"
              className={`
                flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all
                ${selectedCountry === name
                  ? "bg-[#4C69DD]/10 text-text border-2 border-primary dark:border-text-secondary font-semibold"
                  : "bg-gray-100 dark:bg-background border-none text-text hover:border-[#4C69DD]"}
              `}
              onClick={() => {
                const newCountry = selectedCountry === name ? "" : name
                setSelectedCountry(newCountry)
                setCurrentPage(1)
              }}
            >
              <Flag code={code} style={{ width: 20, height: 14 }} />
              {name}
            </Button>
          )
        })}
    </div>
  </div>
</section>




      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div>
  <label className="block text-sm font-medium text-text mb-1">City</label>
  <select
    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-background text-text"
    value={selectedCity || "all"}
    onChange={(e) => setSelectedCity(e.target.value === "all" ? "" : e.target.value)}
    disabled={!selectedCountry}
  >
    <option value="all">All cities</option>
    {availableCities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>


        <div>
          <label className="block text-sm font-medium text-text mb-1">Category</label>
          <select
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-background text-text"
            value={selectedCategory || "all"}
            onChange={(e) => setSelectedCategory(e.target.value === "all" ? "" : e.target.value)}
          >
            <option value="all">All categories</option>
            {Object.entries(categories).map(([key]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoadingRecommendations ? (
  <div className="flex justify-center items-center min-h-[200px] col-span-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
) : (
  recommendations.map((rec) => (
    <Link href={`/dashboard/recommendations/${rec.id}`} key={rec.id}>
    <DetailedRecommendationCard
      key={rec.id}
      recommendation={rec}
      categoryIcon={getCategoryIcon(rec.category)}
    />
    </Link>
  ))
)}

</section>

{recommendations.length === 0 && (
  <div className="text-center py-12">
    <div className="bg-[#E7ECF0]/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
      <MapPin className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-primary dark:text-text-secondary mb-2">No recommendations found</h3>
    <p className="text-text mb-6">Try changing your filters or search terms.</p>
    <Button className="bg-primary text-white" onClick={() => {
      setSelectedCategory("")
      setSelectedCity("")
      setSelectedCountry("")
      setSearchQuery("")
    }}>
      Clear all filters
    </Button>
  </div>
)}

{totalPages > 1 && (
  <div className="mt-8 flex justify-center gap-2 flex-wrap">
    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        variant={currentPage === i + 1 ? "default" : "outline"}
        className={`min-w-[36px] h-9 px-3 py-1 text-sm ${
          currentPage === i + 1 ? "bg-[#4C69DD] text-white" : "border-primary dark:border-text-secondary text-primary dark:text-text-secondary"
        }`}
      >
        {i + 1}
      </Button>
    ))}
  </div>
)}


      
    </div>
  )
}
