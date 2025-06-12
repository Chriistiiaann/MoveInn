// Nuevo archivo actualizado con filtros y paginación desde el backend
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronUp, ChevronDown, MapPinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AcommodationCard } from "@/components/housing/acommodation-card"
import axios from "axios"
import { API_ACCOMMODATION_CITIES, API_ACCOMMODATION_COUNTRIES, API_CREATE_ACCOMMODATION, API_SEARCH_ACOMMODATION } from "@/utils/endpoints/config"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/context/authcontext"
import Flag from 'react-world-flags'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { CountrySearch, CitySearch } from "@/components/ui/country-city-search"

countries.registerLocale(enLocale)

interface Acommodation {
  id: string
  title: string
  description: string
  address: string
  city: string
  country: string
  pricePerMonth: number
  numberOfRooms: number
  bathrooms: number
  squareMeters: number
  hasWifi: boolean
  ownerId: string
  availableFrom: string
  availableTo: string
  images: string[]
  publisher: string
  acommodationType: number
}

const getCountryCode = (countryName: string) => {
  return countries.getAlpha2Code(countryName, 'en') || 'UN'
}


const getFlagEmoji = (countryName: string) => {
  const countryCode = countries.getAlpha2Code(countryName, 'en')
  if (!countryCode) return ''
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function AcommodationsPage() {
  const { user } = useAuth()
  const [acommodations, setAcommodations] = useState<Acommodation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [availableFrom, setAvailableFrom] = useState("")
  const [availableTo, setAvailableTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(6)
  const [isLoadingAcommodations, setIsLoadingAcommodations] = useState(false)
  


  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])


  const [countrySearch, setCountrySearch] = useState("")
const filteredCountries = availableCountries
  .filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))
  .map(name => ({
    name,
    code: getCountryCode(name)
  }))
  .filter(c => c.code !== "UN")

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAcommodation, setNewAcommodation] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    country: "",
    pricePerMonth: 0,
    numberOfRooms: 1,
    bathrooms: 1,
    squareMeters: 10,
    hasWifi: false,
    availableFrom: "",
    availableTo: "",
    acommodationType: 0,
    OwnerId: user?.id
  })
  const [isPosting, setIsPosting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setAvailableCities([])
        setSelectedCity("")
        return
      }
  
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(API_ACCOMMODATION_CITIES(selectedCountry), {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAvailableCities(res.data)
      } catch (err) {
        console.error("Error fetching cities:", err)
        setAvailableCities([])
      }
    }
  
    fetchCities()
  }, [selectedCountry])
  
  
  const fetchAcommodations = async () => {
    try {
      setIsLoadingAcommodations(true)
      const token = localStorage.getItem("token")
  
      const payload: any = {
        query: searchQuery,
        sortField: "pricePerMonth",
        sortOrder: "asc",
        availableFrom: availableFrom ? new Date(availableFrom).toISOString() : null,
        availableTo: availableTo ? new Date(availableTo).toISOString() : null,
        country: selectedCountry,
        city: selectedCity,
        page: currentPage,
        limit: limit,
      }
  
      payload.accommodationType = selectedType !== "" ? parseInt(selectedType) : null
  
      const res = await axios.post(API_SEARCH_ACOMMODATION, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
  
      setAcommodations(res.data.items)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error("Error fetching accommodations:", err)
      toast.error("Failed to load accommodations")
    }
    finally {
      setIsLoadingAcommodations(false)
    }
  }
  
  useEffect(() => {
    fetchAcommodations()
  }, [searchQuery, selectedCountry, selectedType, availableFrom, availableTo, currentPage, limit, selectedCity])
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(API_ACCOMMODATION_COUNTRIES, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCountries(res.data)
      } catch (err) {
        console.error("Error fetching countries:", err)
      }
    }
  
    fetchCountries()
  }, [])

  const handleCreate = async () => {
    const requiredFields = [
      "title",
      "description",
      "address",
      "city",
      "country",
      "pricePerMonth",
      "numberOfRooms",
      "bathrooms",
      "squareMeters",
      "availableFrom",
      "availableTo",
      "acommodationType"
    ]
  
    const missingFields = requiredFields.filter(
      (field) => !newAcommodation[field as keyof typeof newAcommodation]
    )
  
    if (missingFields.length > 0 || imageFiles.length === 0) {
      toast.error("Please fill in all required fields and upload at least one image.")
      return
    }
  
    try {
      const token = localStorage.getItem("token")
      const ownerId = user?.id
      if (!ownerId) return toast.error("Missing user ID")
  
      const formData = new FormData()
      formData.append("Title", newAcommodation.title)
      formData.append("Description", newAcommodation.description)
      formData.append("Address", newAcommodation.address)
      formData.append("City", newAcommodation.city)
      formData.append("Country", newAcommodation.country)
      formData.append("PricePerMonth", String(newAcommodation.pricePerMonth))
      formData.append("NumberOfRooms", String(newAcommodation.numberOfRooms))
      formData.append("Bathrooms", String(newAcommodation.bathrooms))
      formData.append("SquareMeters", String(newAcommodation.squareMeters))
      formData.append("AcommodationType", String(newAcommodation.acommodationType))
      formData.append("AvailableFrom", new Date(newAcommodation.availableFrom).toISOString())
      formData.append("AvailableTo", new Date(newAcommodation.availableTo).toISOString())
      formData.append("OwnerId", ownerId)
  
      imageFiles.forEach((file) => {
        formData.append("AccomodationImages", file)
      })
  
      setIsPosting(true)
      await axios.post(API_CREATE_ACCOMMODATION, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
  
      toast.success("Accommodation created successfully")
      setShowCreateForm(false)
      setImageFiles([])
      if (!availableCountries.includes(newAcommodation.country)) {
        setAvailableCountries((prev) => [...prev, newAcommodation.country])
      }
  
      await fetchAcommodations()
    } catch (err) {
      console.error("Error creating accommodation:", err)
      toast.error("Error creating accommodation")
    } finally {
      setIsPosting(false)
    }
  }
  
  
  

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Find Accommodations</h1>
            <p className="text-white/80">Choose your perfect place to stay</p>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for houses, flats, or rooms..."
                className="pl-10 bg-white/10 border-white/20 text-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </section>

        <div
          className="flex items-center justify-between cursor-pointer rounded-lg px-4 py-3 mb-6 transition-colors duration-200 bg-gradient-to-r from-accent-light dark:from-accent/70 to-foreground hover:bg-accent/80 border border-dashed border-accent"
          onClick={() => setShowCreateForm(prev => !prev)}
        >
          <div className="flex items-center gap-2">
            {showCreateForm ? (
              <ChevronUp className="h-4 w-4 text-text" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text" />
            )}
            <span className="text-sm font-medium text-text">
              {showCreateForm ? "Hide Accommodation Form" : "Create New Accommodation"}
            </span>
          </div>
        </div>

        <AnimatePresence>
        {showCreateForm && (
          <motion.div
            key="createAccommodationForm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border border-primary rounded-xl shadow p-6 mb-8 bg-foreground">
              <h2 className="text-xl font-bold text-text mb-4">Create a New Accommodation</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Title", name: "title", value: newAcommodation.title },
                  { label: "Address", name: "address", value: newAcommodation.address },
                  { label: "Price Per Month", name: "pricePerMonth", type: "number", value: newAcommodation.pricePerMonth },
                  { label: "Number of Rooms", name: "numberOfRooms", type: "number", value: newAcommodation.numberOfRooms },
                  { label: "Bathrooms", name: "bathrooms", type: "number", value: newAcommodation.bathrooms },
                  { label: "Square Meters", name: "squareMeters", type: "number", value: newAcommodation.squareMeters },
                  { label: "Available From", name: "availableFrom", type: "date", value: newAcommodation.availableFrom },
                  { label: "Available To", name: "availableTo", type: "date", value: newAcommodation.availableTo },
                ].map(({ label, name, value, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
                    <Input
                      type={type}
                      name={name}
                      value={value}
                      onChange={(e) => setNewAcommodation({ ...newAcommodation, [name]: type === "number" ? parseFloat(e.target.value) : e.target.value })}
                      className="text-primary-dark text-sm border border-[#4C69DD] focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                  <CountrySearch
                    value={newAcommodation.country}
                    onChange={(val) => {
                      setNewAcommodation((prev) => ({
                        ...prev,
                        country: val,
                        city: "", // reset city when country changes
                      }))
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                  <CitySearch
                    value={newAcommodation.city}
                    onChange={(val) => {
                      setNewAcommodation((prev) => ({
                        ...prev,
                        city: val
                      }))
                    }}
                    country={newAcommodation.country}
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Accommodation Type</label>
                  <select
                    value={newAcommodation.acommodationType}
                    onChange={(e) => setNewAcommodation({ ...newAcommodation, acommodationType: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-[#4C69DD] bg-foreground text-primary-dark text-sm p-2 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none"
                  >
                    <option value={0}>Room</option>
                    <option value={1}>House</option>
                    <option value={2}>Apartment</option>
                    <option value={3}>Rural</option>
                    <option value={4}>Others</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={newAcommodation.hasWifi}
                    onChange={(e) => setNewAcommodation({ ...newAcommodation, hasWifi: e.target.checked })}
                  />
                  <label className="text-sm text-text-secondary">WiFi available</label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea
                  value={newAcommodation.description}
                  onChange={(e) => setNewAcommodation({ ...newAcommodation, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the accommodation..."
                  className="w-full rounded-md border border-[#4C69DD] placeholder:text-gray-500 text-primary-dark text-sm p-3 focus:ring-2 focus:ring-[#4C69DD] focus:outline-none resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImageFiles(Array.from(e.target.files))
                    }
                  }}
                  className="w-full rounded-md border border-[#4C69DD] text-primary-dark text-sm p-2 bg-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#4C69DD] file:text-white hover:file:bg-[#3b5ccd]"
                />

                {imageFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageFiles.map((file, index) => (
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
                onClick={handleCreate}
                disabled={isPosting}
                className="bg-[#4C69DD] hover:bg-[#3b5ccd] text-white"
              >
                {isPosting ? "Posting..." : "Create Accommodation"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Bloque de países con banderas y búsqueda */}
<section className="mb-6">
  <div className="bg-foreground p-4 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-2 text-text">Filter by Country</h2>

    <Input
      placeholder="Search countries..."
      value={countrySearch}
      onChange={(e) => setCountrySearch(e.target.value)}
      className="mb-4 text-sm border-primary dark:border-text-secondary text-text"
    />

    <div className={`flex flex-wrap gap-2 ${filteredCountries.length > 12 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
      {filteredCountries.map((country) => (
        <Button
        key={country.name}
        variant="outline"
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all
          ${selectedCountry === country.name
            ? "bg-[#4C69DD]/10 text-text border-2 border-primary dark:border-text-secondary font-semibold"
            : "bg-gray-100 dark:bg-background border-none text-text hover:border-[#4C69DD]"}
        `}
        onClick={() => {
          const newCountry = selectedCountry === country.name ? "" : country.name
          setSelectedCountry(newCountry)
          setCurrentPage(1)
        }}
      >
        <Flag code={getCountryCode(country.name)} style={{ width: 20, height: 14 }} />
        {country.name}
      </Button>
      
      ))}
    </div>
  </div>
</section>


        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
  <label className="block text-sm font-medium text-text mb-1">City</label>
  <select
    className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text bg-foreground"
    value={selectedCity}
    onChange={(e) => {
      setSelectedCity(e.target.value)
      setCurrentPage(1)
    }}
    disabled={availableCities.length === 0}
  >
    <option value="">All Cities</option>
    {availableCities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Accommodation Type</label>
            <select
              className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text bg-foreground"
              value={selectedType || ""}
              onChange={(e) => {
                setSelectedType(e.target.value === "" ? "" : e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="">All Types</option>
              <option value="0">Room</option>
              <option value="1">House</option>
              <option value="2">Apartment</option>
              <option value="3">Rural</option>
              <option value="4">Others</option>
            </select>
          </div>
          
          <div>
  <label className="block text-sm font-medium text-text mb-1">Available From</label>
  <input
    type="date"
    className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text"
    value={availableFrom}
    onChange={(e) => {
      setAvailableFrom(e.target.value)
      setCurrentPage(1)
    }}
  />
</div>

<div>
  <label className="block text-sm font-medium text-text mb-1">Available To</label>
  <input
    type="date"
    className="w-full border rounded-md p-2 border-primary dark:border-text-secondary text-text"
    value={availableTo}
    onChange={(e) => {
      setAvailableTo(e.target.value)
      setCurrentPage(1)
    }}
  />
</div>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
        {isLoadingAcommodations ? (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : acommodations.length === 0 ? (
          <div className="col-span-full flex flex-col justify-center items-center min-h-[200px] text-center text-text-secondary">
            <MapPinOff className="h-12 w-12 text-primary dark:text-text-secondary mb-4" />
            <p className="text-text">No accommodations found for the selected filters.</p>
          </div>
        ) : (
          acommodations.map((acommodation) => (
            <Link href={`/dashboard/housing/${acommodation.id}`} key={acommodation.id}>
              <AcommodationCard acommodation={acommodation} />
            </Link>
          ))
        )}

</section>


        {/* Paginación */}
        {totalPages > 1 && (
  <div className="mt-6 flex justify-center gap-2 flex-wrap">
    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        variant={i + 1 === currentPage ? "default" : "outline"}
        className={`border-primary dark:border-text-secondary text-primary dark:text-text min-w-[36px] h-9 px-3 py-1 text-sm ${i + 1 === currentPage ? "bg-primary text-white" : ""}`}
      >
        {i + 1}
      </Button>
    ))}
  </div>
)}

      </main>
    </div>
  )
}
