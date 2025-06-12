"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_ADMIN_DELETE_RECOMMENDATION, API_ALL_RECOMMENDATION, API_DELETE_RECOMMENDATION } from "@/utils/endpoints/config"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { getCookie } from "cookies-next"

interface Recommendation {
  id: string
  title: string
  description: string
  category: number
  address: string
  city: string
  country: string
  rating: number
  createdAt: string
  userId: string
  tags: string[]
  recommendationImages: {
    id: string
    url: string
    createdAt: string
    userId: string
    user: string
    recommendationId: string
    recommendation: string
  }[]
}

const categoryByNumber: Record<number, string> = {
  0: "Restaurant",
  1: "Cafeteria",
  2: "Museum",
  3: "LeisureZone",
  4: "Park",
  5: "HistoricalSite",
  6: "Shopping",
  7: "Bar",
  8: "Other",
}

const getCategoryBadgeColor = (category: number) => {
  const slug = categoryByNumber[category]?.toLowerCase() || "other"
  switch (slug) {
    case "restaurant":
      return "bg-secondary text-green-900"
    case "cafeteria":
      return "bg-pink-200 text-pink-900"
    case "museum":
      return "bg-primary text-white"
    case "leisurezone":
      return "bg-amber-400 text-amber-900"
    case "park":
      return "bg-secondary-greenblue text-green-900"
    case "historicalsite":
      return "bg-yellow-200 text-yellow-900"
    case "shopping":
      return "bg-purple-200 text-purple-900"
    case "bar":
      return "bg-[#0E1E40] text-white"
    case "other":
      return "bg-gray-300 text-gray-800"
    default:
      return "bg-gray-200 text-gray-700"
  }
}

export function RecommendationsTable() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selected, setSelected] = useState<Recommendation | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token")
        const res = await axios.get<Recommendation[]>(API_ALL_RECOMMENDATION, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRecommendations(res.data)
      } catch (err) {
        console.error("Error fetching recommendations", err)
      }
    }

    fetchData()
  }, [])

  const handleOpen = (rec: Recommendation) => {
    setSelected(rec)
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
      await axios.delete(API_ADMIN_DELETE_RECOMMENDATION(selected.id), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecommendations(prev => prev.filter(r => r.id !== selected.id))
      handleClose()
      toast.success(`Recommendation "${selected.title}" deleted successfully`)
    } catch (err) {
      console.error("Error deleting recommendation", err)
      toast.error("Failed to delete recommendation. Please try again.")
    }
  }

  return (
    <Card className="bg-foreground border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-text">Recommendations</CardTitle>
        <CardDescription className="text-text-secondary">
          View and manage all platform recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-800">
                <TableHead className="text-text font-semibold">Title</TableHead>
                <TableHead className="text-text font-semibold">Description</TableHead>
                <TableHead className="text-text font-semibold">Category</TableHead>
                <TableHead className="text-text font-semibold">Rating</TableHead>
                <TableHead className="text-text font-semibold">Address</TableHead>
                <TableHead className="text-text font-semibold">Tags</TableHead>
                <TableHead className="text-text font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((rec) => (
                <TableRow
                  key={rec.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-accent/10"
                >
                  <TableCell className="font-medium text-text max-w-[250px] truncate whitespace-nowrap overflow-hidden">
                    {rec.title}
                  </TableCell>
                  <TableCell className="text-text max-w-[250px] truncate whitespace-nowrap overflow-hidden">
                    {rec.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeColor(rec.category)}>
                      {categoryByNumber[rec.category] || "Other"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text">{rec.rating}</TableCell>
                  <TableCell className="text-text max-w-[180px] truncate">
                    {rec.address}, {rec.city}
                  </TableCell>
                  <TableCell className="text-text text-xs">
                    {rec.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {rec.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-muted-foreground text-[10px] px-1.5 py-0.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={open && selected?.id === rec.id} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpen(rec)}
                          className="flex items-center gap-1 text-text"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md dark:border-gray-800">
                        <DialogHeader>
                          <DialogTitle className="text-primary dark:text-text-secondary">Delete Recommendation</DialogTitle>
                          <DialogDescription className="text-text mb-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-destructive">{selected?.title}</span>?
                          </DialogDescription>
                        </DialogHeader>

                        <div className="text-text text-sm mb-4">
                          <p className="font-semibold mb-1">Description:</p>
                          <div className="border rounded p-3 max-h-40 overflow-y-auto bg-muted whitespace-pre-line">
                            {selected?.description || "No description"}
                          </div>
                        </div>

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
