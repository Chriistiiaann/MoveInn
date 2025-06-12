"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Pencil } from "lucide-react"
import { format } from "date-fns"

import {
  API_GET_ALL_REVIEWS,
  API_ADMIN_DELETE_REVIEW
} from "@/utils/endpoints/config"
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
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { getCookie } from "cookies-next"
import { toast } from "sonner"

interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  user: {
    name: string
    lastName: string
    avatarUrl: string
  }
  accommodationId?: string
  recommendationId?: string
}

export function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [selected, setSelected] = useState<Review | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token")
        if (!token) {
          console.error("No token found")
          return
        }
        const res = await axios.get<Review[]>(API_GET_ALL_REVIEWS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Reviews fetched:", res.data)
        setReviews(res.data)
      } catch (err) {
        console.error("Error fetching reviews", err)
      }
    }

    fetchData()
  }, [])

  const handleOpen = (review: Review) => {
    setSelected(review)
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
      await axios.delete(API_ADMIN_DELETE_REVIEW(selected.id), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReviews((prev) => prev.filter((r) => r.id !== selected.id))
      handleClose()
      toast.success(`Review deleted successfully`)
    } catch (err) {
      console.error("Error deleting review", err)
      toast.error("Failed to delete review. Please try again.")
    }
  }

  return (
    <Card className="bg-foreground border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-text">Reviews</CardTitle>
        <CardDescription className="text-text-secondary">
          View and manage all user reviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-800">

                <TableHead className="text-text font-semibold">Content</TableHead>
                <TableHead className="text-text font-semibold">Created At</TableHead>
                <TableHead className="text-text font-semibold">User ID</TableHead>
                <TableHead className="text-text font-semibold">Linked To</TableHead>
                <TableHead className="text-text font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow
                  key={r.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-accent/10"
                >
                  <TableCell className="text-text max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {r.content}
                  </TableCell>
                  <TableCell className="text-text">{format(new Date(r.createdAt), "PPP")}</TableCell>
                  <TableCell className="text-text text-xs">{r.user?.name}</TableCell>
                  <TableCell className="text-text text-xs">
                    {r.accommodationId ? `Accommodation: ${r.accommodationId}` : r.recommendationId ? `Recommendation: ${r.recommendationId}` : "-"}
                  </TableCell>
                  <TableCell className="text-right text-text">
                    <div className="flex justify-end">
                      <Dialog open={open && selected?.id === r.id} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpen(r)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md z-50 border border-gray-200 dark:border-gray-800">
  <DialogHeader>
    <DialogTitle className="text-primary dark:text-text-secondary">Delete Review</DialogTitle>
    <DialogDescription className="text-text mb-2">
      Are you sure you want to delete this review?
    </DialogDescription>
  </DialogHeader>

  <div className="text-text border rounded p-3 max-h-60 overflow-y-auto text-sm bg-muted">
    {selected?.content || "No content available"}
  </div>

  <DialogFooter className="mt-4">
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
