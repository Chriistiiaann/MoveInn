"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_SEARCH_ACOMMODATION } from "@/utils/endpoints/config"
import { Button } from "@/components/ui/button"

export default function AccommodationList() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState("")
  const [type, setType] = useState<number | null>(null)

  const fetchAccommodations = async () => {
    setLoading(true)
    try {
      const res = await axios.post(API_SEARCH_ACOMMODATION, {
        query,
        country,
        accommodationType: type,
        page,
        limit: 6, // puedes ajustar el límite aquí
      })
      setData(res.data)
    } catch (err) {
      console.error("Error loading accommodations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccommodations()
  }, [page, query, country, type])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded-md text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          placeholder="Country"
          className="border px-3 py-2 rounded-md text-sm"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-md text-sm"
          value={type ?? ""}
          onChange={(e) => setType(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Types</option>
          <option value="0">Room</option>
          <option value="1">House</option>
          <option value="2">Apartment</option>
          <option value="3">Rural</option>
          <option value="4">Other</option>
        </select>
      </div>

      {/* Resultados */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.items?.map((a: any) => (
            <div key={a.id} className="bg-white shadow rounded-md p-4">
              <h3 className="font-bold">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.city}, {a.country}</p>
              <p className="text-sm truncate">{a.description}</p>
              <p className="text-sm text-primary mt-1">€{a.pricePerMonth}/month</p>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {data && (
        <div className="flex gap-2 justify-center mt-4">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Previous
          </Button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {data.currentPage} of {data.totalPages}
          </span>
          <Button onClick={() => setPage((p) => p + 1)} disabled={data.currentPage >= data.totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
