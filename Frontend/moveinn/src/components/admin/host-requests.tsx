"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  API_BASE_IMAGE_URL,
  API_GET_HOSTS,
  API_HOST_GET_REQUESTS,
  API_HOST_REQUEST_ACCEPT,
  API_HOST_REQUEST_REJECT
} from "@/utils/endpoints/config"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Inbox } from "lucide-react"

interface HostRequest {
  id: string
  reason: string
  userName: string
  avatarUrl: string
  status: number
  hostSince: string | null
  updatedAt: string | null
  specialties: string[]
}

interface HostRequestProps {
  setHosts: React.Dispatch<React.SetStateAction<any[]>>;
}

export function HostRequests({ setHosts }: HostRequestProps) {

  const [requests, setRequests] = useState<HostRequest[]>([])
  const [selected, setSelected] = useState<HostRequest | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const fetchRequests = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.get(API_HOST_GET_REQUESTS, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(res.data)
    } catch (err) {
      console.error("Error loading host requests", err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (id: string, action: "accept" | "reject") => {
    const token = localStorage.getItem("token")
    const url =
      action === "accept"
        ? API_HOST_REQUEST_ACCEPT(id)
        : API_HOST_REQUEST_REJECT(id)

        try {
          await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
        
          // 🆕 Si fue aceptado, refrescamos la lista de hosts
          if (action === "accept") {
            const hostsRes = await axios.get(API_GET_HOSTS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setHosts(hostsRes.data);
          }
        
          setFeedback(
            action === "accept"
              ? "Request accepted successfully"
              : "Request rejected successfully"
          );
          setSelected(null);
          fetchRequests();
        
          setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
          console.error("Error performing action:", err);
          setFeedback("Something went wrong. Try again.");
          setTimeout(() => setFeedback(null), 3000);
        }
  }

  return (
    <>
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-white px-4 py-2 rounded shadow">
          {feedback}
        </div>
      )}

<div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted/40">
  {requests.filter((r) => r.status === 1).length === 0 ? (
    <div className="flex flex-col items-center justify-center text-center mt-10 text-muted-foreground">
      <Inbox className="w-16 h-16 mb-4 text-text" />
      <p className="text-lg font-semibold text-text">No Host requests pending</p>
      <p className="text-sm text-text-secondary dark:text-gray-400">
        When someone requests to be a host, it will appear here.
      </p>
    </div>
  ) : (
    requests
      .filter((r) => r.status === 1)
      .map((req) => (
        <Card
          key={req.id}
          className="min-h-[180px] p-4 flex flex-col justify-between gap-2 text-text bg-background border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center gap-4">
          {req.avatarUrl && req.avatarUrl !== "default-avatar-url" ? (
          <img
            src={API_BASE_IMAGE_URL + req.avatarUrl}
            alt={req.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm uppercase">
              {req.userName.charAt(0)}
            </div>
          )}


            <div>
              <p className="font-semibold">{req.userName}</p>
              <p className="text-xs text-text-secondary">
                {req.specialties.join(", ")}
              </p>
            </div>
          </div>
          <p className="text-sm mt-2 italic">"{req.reason}"</p>
          <Button
            size="sm"
            className="mt-2 w-fit bg-primary hover:bg-primary/90 text-white"
            onClick={() => setSelected(req)}
          >
            Manage
          </Button>
        </Card>
      ))
  )}
</div>


      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-foreground rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-text mb-2">
              Manage Request: {selected.userName}
            </h2>
            <p className="text-sm text-text-secondary mb-4">{selected.reason}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {selected.specialties.map((spec) => (
                <span
                  key={spec}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setSelected(null)}
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleAction(selected.id, "reject")}
              >
                Reject
              </Button>
              <Button
                variant="default"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleAction(selected.id, "accept")}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
