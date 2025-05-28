"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AcommodationCard } from "@/components/housing/acommodation-card"
import axios from "axios"
import { API_ALL_ACOMMODATIONS } from "@/utils/endpoints/config"

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
  acommodationType: number
}

export default function AcommodationsPage() {
  const [acommodations, setAcommodations] = useState<Acommodation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")

  useEffect(() => {
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

    fetchAcommodations()
  }, [])

  // Generar países únicos
  const uniqueCountries = Array.from(new Set(acommodations.map((a) => a.country).filter(Boolean)))

  // Agrupar ciudades por país
  const citiesByCountry: Record<string, string[]> = {}
  acommodations.forEach((a) => {
    if (a.country && a.city) {
      if (!citiesByCountry[a.country]) {
        citiesByCountry[a.country] = []
      }
      if (!citiesByCountry[a.country].includes(a.city)) {
        citiesByCountry[a.country].push(a.city)
      }
    }
  })

  const currentCities = selectedCountry ? citiesByCountry[selectedCountry] || [] : []

  const filtered = acommodations.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCountry = selectedCountry ? a.country === selectedCountry : true
    const matchesCity = selectedCity ? a.city === selectedCity : true
    const matchesType = selectedType ? a.acommodationType === parseInt(selectedType) : true

    return matchesSearch && matchesCountry && matchesCity && matchesType
  })

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Find Accommodations</h1>
              <p className="text-white/80">Choose your perfect place to stay</p>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for houses, flats, or rooms..."
                  className="pl-10 bg-white/10 border-white/20 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Country</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-background text-text"
              value={selectedCountry || "all"}
              onChange={(e) => {
                const val = e.target.value
                setSelectedCountry(val === "all" ? "" : val)
                setSelectedCity("")
              }}
            >
              <option value="all">All countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">City</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-background px-3 py-2 text-text"
              value={selectedCity || "all"}
              onChange={(e) => setSelectedCity(e.target.value === "all" ? "" : e.target.value)}
              disabled={!selectedCountry}
            >
              <option value="all">All cities</option>
              {currentCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Accommodation Type</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-background px-3 py-2 text-text"
              value={selectedType || "all"}
              onChange={(e) => setSelectedType(e.target.value === "all" ? "" : e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="0">Room</option>
              <option value="1">House</option>
              <option value="2">Apartment</option>
              <option value="3">Rural</option>
              <option value="4">Others</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((acommodation) => (
            <Link href={`/dashboard/housing/${acommodation.id}`} key={acommodation.id}>
              <AcommodationCard acommodation={acommodation} />
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
