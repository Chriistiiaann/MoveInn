"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from 'lucide-react'
import Image from "next/image"
import { API_GET_COUNTRYSEARCH, API_GET_CITYSEARCH } from "@/utils/endpoints/config"
import type { Country, CountrySearchProps, CitySearchProps } from "@/types/country"


export function CountrySearch({
  value,
  onChange,
  onFlagChange,
  placeholder = "Search for a country...",
  className = "",
}: CountrySearchProps) {
  const [query, setQuery] = useState(value)
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize with the current value if it exists
  useEffect(() => {
    if (value) {
      setQuery(value)
    }
  }, [value])

  // Search for countries when query changes
  useEffect(() => {
    const fetchCountries = async () => {
      if (query.length < 2) {
        setCountries([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(API_GET_COUNTRYSEARCH(query))
        if (response.ok) {
          const data = await response.json()
          setCountries(data)
        } else {
          console.error("Error response:", await response.text())
          setCountries([])
        }
      } catch (error) {
        console.error("Error fetching countries:", error)
        setCountries([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchCountries, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (country: Country) => {
    onChange(country.name)
    setQuery(country.name)
    setSelectedFlag(country.flag)
    if (onFlagChange) {
      onFlagChange(country.flag)
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange("")
    setQuery("")
    setSelectedFlag(null)
    if (onFlagChange) {
      onFlagChange("")
    }
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className} border-primary dark:border-text-secondary`}>
      <div className="relative flex items-center">
        {selectedFlag && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-7 overflow-hidden rounded-sm">
            <Image
              src={selectedFlag || "/placeholder.svg"}
              alt="Flag"
              width={28}
              height={20}
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full border border-primary dark:border-text-secondary rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-text ${
            selectedFlag ? "pl-12" : "pl-10"
          }`}
          placeholder={placeholder}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {!selectedFlag && <Search className="h-5 w-5 text-gray-400" />}
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2 || countries.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto bg-foreground border-primary dark:border-text-secondary"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4 bg-background">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-text">Searching...</span>
            </div>
          ) : countries.length > 0 ? (
            <ul className="py-0 border-none">
              {countries.map((country) => (
                <li
                  key={country.name}
                  className="flex items-center px-3 py-2 bg-background hover:bg-foreground cursor-pointer"
                  onClick={() => handleSelect(country)}
                >
                  <div className="h-5 w-7 mr-3 overflow-hidden rounded-sm">
                    <Image
                      src={country.flag.trimStart() || "/placeholder.svg"}
                      alt={country.name}
                      width={28}
                      height={20}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-text">{country.name}</span>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-3 text-text text-center">No countries found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function CitySearch({
  value,
  onChange,
  country,
  disabled = false,
  placeholder = "Search for a city...",
  className = "",
}: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [cities, setCities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize with the current value if it exists
  useEffect(() => {
    if (value) {
      setQuery(value)
    }
  }, [value])

  // Search for cities when query changes
  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2 || !country) {
        setCities([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(API_GET_CITYSEARCH(country, query))
        if (response.ok) {
          const data = await response.json()
          setCities(data)
        } else {
          console.error("Error response:", await response.text())
          setCities([])
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
        setCities([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchCities, 300)
    return () => clearTimeout(timeoutId)
  }, [query, country])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (city: string) => {
    onChange(city)
    setQuery(city)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange("")
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full border border-primary dark:border-text-secondary rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-text"
          placeholder={country ? placeholder : "Select a country first"}
          disabled={disabled || !country}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && !disabled && country && (query.length >= 2 || cities.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-background border border-primary dark:border-text-secondary rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-text">Searching...</span>
            </div>
          ) : cities.length > 0 ? (
            <ul className="py-1">
              {cities.map((city) => (
                <li
                  key={city}
                  className="px-3 py-2 hover:bg-foreground cursor-pointer text-text"
                  onClick={() => handleSelect(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-3 text-text text-center">No cities found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
