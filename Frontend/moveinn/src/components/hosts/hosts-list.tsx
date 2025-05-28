"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_GET_HOSTS } from "@/utils/endpoints/config"
import { Card } from "@/components/ui/card"

interface Host {
  hostId: string
  userId: string
  userName: string
  avatarUrl: string
  hostSince: string
  specialties: string[]
}

export function HostList() {
  const [hosts, setHosts] = useState<Host[]>([])

  useEffect(() => {
    const fetchHosts = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await axios.get(API_GET_HOSTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setHosts(res.data)
      } catch (err) {
        console.error("Error fetching hosts:", err)
      }
    }

    fetchHosts()
  }, [])

  return (
    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted/40">
      {hosts.map((host) => (
        <Card
          key={host.hostId}
          className="min-h-[160px] p-4 flex flex-col justify-between gap-2 text-text bg-background border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <img
              src={host.avatarUrl}
              alt={host.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{host.userName}</p>
              <p className="text-xs text-text-secondary">{host.specialties.join(", ")}</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Host since:{" "}
            <span className="text-text font-medium">
              {new Date(host.hostSince).toLocaleDateString()}
            </span>
          </p>
        </Card>
      ))}
    </div>
  )
}
