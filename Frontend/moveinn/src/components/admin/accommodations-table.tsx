"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Pencil } from "lucide-react"

import { API_ALL_ACCOMMODATION } from "@/utils/endpoints/config"
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
        const token = localStorage.getItem("token")
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
                            <DialogTitle>Delete Accommodation</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              <span className="font-semibold text-destructive">
                                {selected?.title}
                              </span>
                              ?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="ghost" className="text-text" onClick={handleClose}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              className="text-white bg-red-500 hover:bg-red-600"
                              onClick={() => {
                                console.log("🗑 DELETE ACCOMMODATION:", selected?.id)
                                handleClose()
                              }}
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
