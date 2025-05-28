"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { API_GET_HOSTS } from "@/utils/endpoints/config"

interface Host {
  hostId: string
  userId: string
  userName: string
  avatarUrl: string
  hostSince: string
  specialties: string[]
}

export function HostsTable() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get<Host[]>(API_GET_HOSTS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setHosts(res.data)
      } catch (err) {
        console.error("Error fetching hosts", err)
      }
    }

    fetchHosts()
  }, [])

  const handleOpenChange = (value: boolean) => {
    if (!value) setSelectedHost(null)
    setOpen(value)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200 dark:border-gray-800">
          <TableHead className="text-text font-semibold">Name</TableHead>
          <TableHead className="text-text font-semibold">Host Since</TableHead>
          <TableHead className="text-text font-semibold">Specialties</TableHead>
          <TableHead className="text-text font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hosts.map((host) => (
          <TableRow
            key={host.hostId}
            className="border-b border-gray-200 dark:border-gray-800 hover:bg-accent/10"
          >
            <TableCell className="flex items-center gap-2 text-text">
              <img
                src={host.avatarUrl}
                alt={host.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
              {host.userName}
            </TableCell>
            <TableCell className="text-text">
              {new Date(host.hostSince).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-text">
              {host.specialties.join(", ")}
            </TableCell>
            <TableCell className="text-text">
              <div className="flex justify-end">
                <Dialog
                  open={open && selectedHost?.hostId === host.hostId}
                  onOpenChange={handleOpenChange}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHost(host)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Modify Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md z-50 border border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Remove Host Status</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove host status from{" "}
                        <span className="font-semibold">{selectedHost?.userName}</span>?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        className="text-text"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          console.log("🔧 Remove host status for", selectedHost?.userId)
                          setOpen(false)
                        }}
                      >
                        Remove Host
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
