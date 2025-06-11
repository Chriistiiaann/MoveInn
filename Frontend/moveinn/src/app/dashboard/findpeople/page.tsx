"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useAuth } from "@/context/authcontext"
import { API_SEARCH_USERS, API_USER_CITIES, API_USER_COUNTRIES } from "@/utils/endpoints/config"
import UserCard from "@/components/findpeople/user-card"
import Flag from "react-world-flags"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"

countries.registerLocale(enLocale)

function getCountryCode(name: string) {
  return countries.getAlpha2Code(name, "en") || "UN"
}

export default function UsersExplorePage() {
  const { user } = useAuth()

  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(9)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(API_USER_COUNTRIES, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCountries(res.data)
      } catch (err) {
        console.error("Error loading countries", err)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setAvailableCities([])
        setSelectedCity("")
        return
      }

      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(API_USER_CITIES(selectedCountry), {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableCities(res.data)
      } catch (err) {
        console.error("Error loading cities", err)
        setAvailableCities([])
      }
    }

    fetchCities()
  }, [selectedCountry])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const token = localStorage.getItem("accessToken")

        const res = await axios.post(
          API_SEARCH_USERS,
          {
            query: searchTerm,
            city: selectedCity,
            country: selectedCountry,
            page: currentPage,
            limit
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log("data", res.data)
        const data = res.data
        setUsers(data.items.filter((u: any) => u.id !== user?.id))
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Error fetching users:", err)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (user?.id) fetchUsers()
  }, [user?.id, searchTerm, selectedCity, selectedCountry, currentPage, limit])

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">

        {/* Buscador */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Find Erasmus Friends</h1>
            <p className="text-white/80">Search and connect with other Erasmus students</p>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, school, city, or country..."
                className="pl-10 bg-white/10 border-white/20 text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </section>

        {/* Buscador de Países con banderas */}
        <section className="mb-6">
          <div className="bg-foreground p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-text">Filter by Country</h2>
            <Input
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="mb-4 text-sm border-primary text-text"
            />
            <div className={`flex flex-wrap gap-2 ${filteredCountries.length > 12 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
              {filteredCountries.map((country) => (
                <Button
                  key={country.name}
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all
                    ${selectedCountry === country.name
                      ? "bg-[#4C69DD]/10 text-text border-2 border-primary font-semibold"
                      : "bg-gray-100 dark:bg-background border-none text-text hover:border-[#4C69DD]"
                    }`}
                  onClick={() => {
                    const newCountry = selectedCountry === country.name ? "" : country.name
                    setSelectedCountry(newCountry)
                    setSelectedCity("")
                    setCurrentPage(1)
                  }}
                >
                  <Flag code={country.code} style={{ width: 20, height: 14 }} />
                  {country.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Selector de ciudad */}
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">City</label>
            <select
              className="w-full border rounded-md px-3 py-2 border-primary text-text bg-foreground"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setCurrentPage(1)
              }}
              disabled={!availableCities.length}
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Tarjetas de usuario */}
        {isLoadingUsers ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((u) => (
                <UserCard
                  key={u.id}
                  user={u}
                  onClick={() => window.location.href = `/dashboard/findpeople/${u.id}`}
                />
              ))}
            </div>

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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found. Try a different search or filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}
