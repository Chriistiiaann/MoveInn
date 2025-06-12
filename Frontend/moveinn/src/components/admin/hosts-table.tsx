"use client"

import { useState } from "react"
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
import axios from "axios";
import { API_BASE_IMAGE_URL, API_HOST_REQUEST_REJECT } from "@/utils/endpoints/config";
import { getCookie } from "cookies-next"


interface Host {
  hostId: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  hostSince: string;
  specialties: string[];
}

interface HostsTableProps {
  hosts: Host[];
  setHosts: React.Dispatch<React.SetStateAction<Host[]>>;
}

export function HostsTable({ hosts, setHosts }: HostsTableProps) {

  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [open, setOpen] = useState(false)


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
            <TableCell className="flex items-center gap-2 text-text">
  {host.avatarUrl === "default-avatar-url" || !host.avatarUrl ? (
    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
      {host.userName?.charAt(0).toUpperCase()}
    </div>
  ) : (
    <img
      src={`${API_BASE_IMAGE_URL}/${host.avatarUrl}`}
      alt={host.userName}
      className="w-8 h-8 rounded-full object-cover"
    />
  )}
</TableCell>

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
                        onClick={async () => {
                          if (!selectedHost) return;
                        
                          try {
                            const token = getCookie("token");
                            await axios.post(
                              API_HOST_REQUEST_REJECT(selectedHost.hostId),
                              {},
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                        
                            // 🆕 Actualizamos la lista de hosts en frontend
                            setHosts((prev) => prev.filter((h) => h.hostId !== selectedHost.hostId));
                            setOpen(false);
                          } catch (err) {
                            console.error("❌ Error removing host:", err);
                          }
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
