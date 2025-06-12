"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Pencil } from "lucide-react"

import { API_ADMIN_DELETE_ACCOMMODATION, API_ALL_ACCOMMODATION } from "@/utils/endpoints/config"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { getCookie } from "cookies-next"
import { toast } from "sonner"

interface Accommodation {
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
  acommodationType: number
}

export function AccommodationsTable() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [selected, setSelected] = useState<Accommodation | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token")
        if (!token) {
          console.error("No token found")
          return
        }
        const res = await axios.get<Accommodation[]>(API_ALL_ACCOMMODATION, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAccommodations(res.data)
      } catch (err) {
        console.error("Error fetching accommodations", err)
      }
    }

    fetchData()
  }, [])

  const handleOpen = (acc: Accommodation) => {
    setSelected(acc)
    setOpen(true)
  }

  const handleClose = () => {
    setSelected(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      const token = getCookie("token")
      if (!token) {
        console.error("No token found")
        return
      }
      await axios.delete(API_ADMIN_DELETE_ACCOMMODATION(selected.id), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAccommodations((prev) => prev.filter((a) => a.id !== selected.id))
      handleClose()
      toast.success(`Accommodation "${selected.title}" deleted successfully`)
    } catch (err) {
      console.error("Error deleting accommodation", err)
      toast.error("Failed to delete accommodation. Please try again.")
    }
  }

  return (
    <Card className="bg-foreground border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-text">Accommodations</CardTitle>
        <CardDescription className="text-text-secondary">
          View and manage all platform accommodations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-800">
                <TableHead className="text-text font-semibold">Title</TableHead>
                <TableHead className="text-text font-semibold">Description</TableHead>
                <TableHead className="text-text font-semibold">City</TableHead>
                <TableHead className="text-text font-semibold">Price</TableHead>
                <TableHead className="text-text font-semibold">Rooms</TableHead>
                <TableHead className="text-text font-semibold">Available</TableHead>
                <TableHead className="text-text font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accommodations.map((acc) => (
                <TableRow
                  key={acc.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-accent/10"
                >
                  <TableCell className="font-medium text-text">{acc.title}</TableCell>
                  <TableCell className="text-text max-w-[300px] truncate whitespace-nowrap overflow-hidden">
                    {acc.description}
                  </TableCell>
                  <TableCell className="text-text">{acc.city}</TableCell>
                  <TableCell className="text-text">€{acc.pricePerMonth}</TableCell>
                  <TableCell className="text-text">{acc.numberOfRooms}</TableCell>
                  <TableCell className="text-text text-sm">
                    {format(new Date(acc.availableFrom), "MMM yyyy")} –{" "}
                    {format(new Date(acc.availableTo), "MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right text-text">
                    <div className="flex justify-end">
                      <Dialog open={open && selected?.id === acc.id} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpen(acc)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md z-50 border border-gray-200 dark:border-gray-800">
  <DialogHeader>
    <DialogTitle className="text-primary dark:text-text-secondary">Delete Accommodation</DialogTitle>
    <DialogDescription className="text-text mb-2">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-destructive">{selected?.title}</span>?
    </DialogDescription>
  </DialogHeader>

  {selected?.description && (
    <div className="text-text text-sm mb-4">
      <p className="font-semibold mb-1">Description:</p>
      <div className="border rounded p-3 max-h-40 overflow-y-auto bg-muted whitespace-pre-line">
        {selected.description}
      </div>
    </div>
  )}

  <DialogFooter>
    <Button variant="ghost" className="dark:text-text-secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button
      variant="default"
      className="bg-red-500 hover:bg-red-600 text-white"
      onClick={handleDelete}
    >
      Confirm Delete
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
        </div>
      </CardContent>
    </Card>
  )
}
