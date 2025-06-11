"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  MapPin,
  Star,
  MessageCircle,
  ChevronDown,
  Globe,
  GraduationCap,
  Clock,
  Users,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { API_HOST_CITIES, API_HOST_COUNTRIES, API_HOST_POST_REQUEST, API_HOST_SEARCH_HOSTS } from "@/utils/endpoints/config";
import axios from "axios";
import { useAuth } from "@/context/authcontext";
import { getCookie } from "cookies-next";
import HostCard from "@/components/hosts/host-card";
import Flag from 'react-world-flags'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)


export default function HostsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showHostModal, setShowHostModal] = useState(false);
  const [reason, setReason] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [citiesFromApi, setCitiesFromApi] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [expertiseSearch, setExpertiseSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const { user } = useAuth()
  const [hosts, setHosts] = useState<any[]>([])

  const visibleHosts = hosts.filter(host => host.id !== user?.id)

  console.log(user)


  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const uniqueSpecialties: string[] = Array.from(
    new Set(
      visibleHosts.flatMap((host) =>
        host?.specialties?.map((s: { id: string; name: string }) => s.name) || []
      )
    )
  ).filter(Boolean).sort();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
 
  const getCountryCode = (countryName: string) => {
    return countries.getAlpha2Code(countryName, 'en') || 'UN'
  }

  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [countrySearch, setCountrySearch] = useState("")
  const filteredCountries = availableCountries
  .filter(name => name.toLowerCase().includes(countrySearch.toLowerCase()))
  .map(name => ({
    name,
    code: getCountryCode(name)
  }))
  .filter(c => c.code !== "UN")

  useEffect(() => {
    const fetchHostCountries = async () => {
      try {
        const token = getCookie("token")
        const res = await axios.get(API_HOST_COUNTRIES, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAvailableCountries(res.data)
      } catch (err) {
        console.error("Error fetching host countries:", err)
      }
    }

    fetchHostCountries()
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (!availableCountries.includes(activeFilter || "")) {
        setCitiesFromApi([])
        setSelectedCity(null)
        return
      }

      try {
        const token = getCookie("token")
        const res = await axios.get(API_HOST_CITIES(activeFilter), {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCitiesFromApi(res.data)
      } catch (err) {
        console.error("Error fetching cities:", err)
        setCitiesFromApi([])
      }
    }

    fetchCities()
  }, [activeFilter, availableCountries])



  useEffect(() => {
    const fetchHosts = async () => {
      setIsLoadingHosts(true);
      const token = getCookie("token");
      try {
        const res = await axios.post(
          API_HOST_SEARCH_HOSTS,
          {
            query: searchQuery,
            country: availableCountries.includes(activeFilter || "") ? activeFilter : "",
            city: selectedCity || "",
            page: currentPage,
            limit: limit,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Hosts response:", res.data)
        setHosts(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      } finally {
        setIsLoadingHosts(false);
      }
    };

    fetchHosts();
  }, [activeFilter, selectedCity, currentPage, searchQuery]);

  // Filter hosts by active filter
  const filteredHosts = visibleHosts.filter((host) => {
    const matchesBackendFilters = activeFilter
      ? host.erasmusCountry?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        host.city?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        host.school?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (Array.isArray(host.specialties) &&
          host.specialties.some((s: any) =>
            typeof s === "string"
              ? s.toLowerCase().includes(activeFilter.toLowerCase())
              : s.name?.toLowerCase().includes(activeFilter.toLowerCase())
          ))
      : true;
  
    const matchesSpecialties =
      selectedSpecialties.length === 0
        ? true
        : Array.isArray(host.specialties) &&
          selectedSpecialties.every((selected) =>
            host.specialties.some((s: any) =>
              typeof s === "string"
                ? s === selected
                : s.name === selected
            )
          );
  
    return matchesBackendFilters && matchesSpecialties;
  });
  
    const handleHostRequestSubmit = async () => {
      try {
        const token = getCookie("token");
      
        const body = {
          userId: user?.id,
          reason,
          specialties,
        };
       
        console.log("Sending host request:", body)
        
        await axios.post(API_HOST_POST_REQUEST, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        setFeedbackMessage("Request submitted successfully!");
        setFeedbackType("success");
      
        setTimeout(() => {
          setFeedbackMessage(null);
          setFeedbackType(null);
        }, 4000);
      
        setShowHostModal(false);
        setReason("");
        setSpecialties([]);
      } catch (error) {
        console.error("Error submitting host request:", error);
        setFeedbackMessage("Something went wrong. Please try again.");
        setFeedbackType("error");
      
        setTimeout(() => {
          setFeedbackMessage(null);
          setFeedbackType(null);
        }, 4000);
      }
      
    };

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
            {/* <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div> */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 bg-repeat"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Local Student Hosts</h1>
                  <p className="text-white/80">
                    Connect with experienced local students who can guide you through your Erasmus journey
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                {!user?.isHost && (
                  <Button
                    className="bg-[#FFBF00] text-[#0E1E40] hover:bg-[#FFBF00]/90 font-semibold"
                    onClick={() => setShowHostModal(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Become a Host
                  </Button>
                )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for hosts by name or university / school..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // reset página cuando cambie
                    }}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  />

                </div>
              </div>
            </div>
          </div>
        </section>

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
                    ${activeFilter === country.name
                      ? "bg-[#4C69DD]/10 text-text border-2 border-primary dark:border-text-secondary font-semibold"
                      : "bg-gray-100 dark:bg-background border-none text-text hover:border-[#4C69DD]"}
                  `}
                  onClick={() => {
                    const newFilter = activeFilter === country.name ? "" : country.name
                    setActiveFilter(newFilter)
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


        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6 order-2 xl:order-1 xl:col-span-1">

            {/* Cities Filter */}
            <Card className="border-none shadow-md bg-foreground py-0">
  <CardContent className="p-4">
    <h2 className="font-semibold text-text-secondary mb-3">Popular Cities</h2>

    <Input
      placeholder="Search cities..."
      value={citySearch}
      onChange={(e) => setCitySearch(e.target.value)}
      className="mb-3 text-sm border-primary dark:border-text-secondary text-text"
    />

    <div
      className={`space-y-2 ${
        citiesFromApi.length > 10 ? "max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted/40" : ""
      }`}
    >
      {citiesFromApi.length === 0 && (
        <p className="text-sm text-gray-400">Select a country to see cities</p>
      )}

      {citiesFromApi
        .filter((city) =>
          city.toLowerCase().includes(citySearch.toLowerCase())
        )
        .map((city) => (
          <Button
            key={city}
            variant="outline"
            className={`w-full bg-background/50 justify-between h-auto py-2 border-none text-gray-800 dark:text-gray-200 ${
              selectedCity === city ? "bg-[#4C69DD] text-white" : ""
            }`}
            onClick={() => {
              setSelectedCity(selectedCity === city ? null : city)
              setCurrentPage(1)
            }}
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{city}</span>
            </div>
          </Button>
        ))}
    </div>
  </CardContent>
</Card>


            {/* Expertise Filter */}
            <Card className="border-none shadow-md bg-foreground py-0">
  <CardContent className="p-4">
    <h2 className="font-semibold text-text-secondary mb-3">Areas of Expertise</h2>

    {/* Search bar */}
    <Input
      placeholder="Search expertise..."
      className="mb-3 text-sm border-primary dark:border-text-secondary text-text"
      value={expertiseSearch}
      onChange={(e) => setExpertiseSearch(e.target.value)}
    />

    {/* Scrollable list if needed */}
    <div
      className={`space-y-2 ${
        uniqueSpecialties.length > 10
          ? "max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted/40"
          : ""
      }`}
    >
      {uniqueSpecialties
        .filter((spec) =>
          spec.toLowerCase().includes(expertiseSearch.toLowerCase())
        )
        .map((specialty) => (
          <Button
            key={specialty}
            variant="outline"
            className={`w-full justify-between h-auto py-2 border-none text-gray-800 dark:text-gray-200 ${
              selectedSpecialties.includes(specialty)
                ? "bg-[#4C69DD] text-white"
                : "bg-background/50 hover:bg-[#4C69DD]/10"
            }`}
            onClick={() => {
              const isSelected = selectedSpecialties.includes(specialty);
              const updated = isSelected
                ? selectedSpecialties.filter((s) => s !== specialty)
                : [...selectedSpecialties, specialty];
              setSelectedSpecialties(updated);
              setCurrentPage(1);
            }}
          >
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span>{specialty}</span>
            </div>
          </Button>
        ))}
    </div>
  </CardContent>
</Card>




            {/* Become a Host */}
            {!user?.isHost && (
              <Card className="border-none shadow-md bg-gradient-to-br from-[#FFBF00]/20 to-foreground">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-text-secondary mb-3">Become a Host</h2>
                  <p className="text-sm text-text mb-4">
                    Help incoming Erasmus students navigate your city and university. Share your knowledge and make new
                    international friends!
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#FFBF00] mt-0.5 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-300">Earn recognition in your university</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#FFBF00] mt-0.5 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-300">Build your international network</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#FFBF00] mt-0.5 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-300">Gain intercultural experience</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#FFBF00] text-[#0E1E40] hover:bg-[#FFBF00]/90"
                    onClick={() => setShowHostModal(true)}
                  >
                    Apply to Become a Host
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Main Content */}
          <div className="order-1 lg:order-1 lg:col-span-3">
            {/* Active Filters */}
            {(activeFilter || selectedCity) && (
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                {activeFilter && (
                  <Badge
                    className="bg-[#4C69DD]/10 text-[#4C69DD] hover:bg-[#4C69DD]/20 px-3 py-1"
                    onClick={() => {setActiveFilter(null); setCurrentPage(1);}}
                  >
                    {activeFilter}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {selectedCity && (
                  <Badge
                    className="bg-[#FFBF00]/10 text-[#FFBF00] hover:bg-[#FFBF00]/20 px-3 py-1"
                    onClick={() => {setSelectedCity(null); setCurrentPage(1);}}
                  >
                    {selectedCity}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}


            {/* View Mode: Grid or Map */}
            {isLoadingHosts ? (
              <div className="col-span-full flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : filteredHosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHosts.map((host) => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-foreground/50 rounded-lg border border-background/10">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-text mb-2">No hosts found</h3>
                <p className="text-text-secondary max-w-md mx-auto mb-6">
                  We couldn't find any hosts matching your filter criteria. Try adjusting your filters or search for a
                  different location.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {feedbackMessage && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[999] px-6 py-3 rounded-md shadow-lg text-sm font-medium transition-opacity duration-300
          ${feedbackType === "success" ? "bg-green-100 dark:bg-green-800 text-green-800 border border-green-300" : ""}
          ${feedbackType === "error" ? "bg-red-100 dark:bg-red-200 text-red-800 border border-red-300" : ""}
        `}>
          {feedbackMessage}
        </div>
      )}


      {showHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-foreground p-6 rounded-lg w-full max-w-lg shadow-xl relative">
            <h2 className="text-xl font-semibold text-text mb-4">Become a Host</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-text mb-1">Why do you want to become a host?</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-text mb-1">Your specialties</label>
                <input
                  type="text"
                  placeholder="Comma-separated list (e.g., Housing, Local Culture)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background"
                  value={specialties.join(", ")}
                  onChange={(e) => setSpecialties(e.target.value.split(",").map(s => s.trim()))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setShowHostModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={handleHostRequestSubmit}
                >
                  Submit Request
                </Button>
              </div>
            </form>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowHostModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
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
    </div>
  )
}
