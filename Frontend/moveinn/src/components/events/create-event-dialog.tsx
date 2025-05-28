"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, Upload, Plus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [date, setDate] = useState<Date>()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background text-text dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary dark:text-text-secondary">Create New Event</DialogTitle>
          <DialogDescription className="text-text">
            Fill in the details below to create a new event for the Erasmus community.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Event Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-text-secondary">Event Title</Label>
            <Input id="title" placeholder="Give your event a catchy title" />
          </div>

          {/* Event Image */}
          <div className="grid gap-2">
            <Label htmlFor="image" className="text-text-secondary">Event Image</Label>
            <div className="border-2 border-dashed rounded-md border-gray-200 p-6 flex flex-col items-center justify-center bg-foreground">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center mb-1">Drag and drop an image here, or click to browse</p>
              <p className="text-xs text-gray-400 text-center">Recommended size: 1200 x 600 pixels</p>
              <Button variant="outline" size="sm" className="mt-4">
                Upload Image
              </Button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-text-secondary">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white text-primary-dark">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time" className="text-text-secondary">Time</Label>
              <div className="flex">
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Clock className="mr-2 h-4 w-4" />
                  Select time
                </Button>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-text-secondary">Location Name</Label>
            <Input id="location" placeholder="e.g. Café del Mar, University Campus" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-text-secondary">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="address" className="pl-10" placeholder="Full address of the event location" />
            </div>
          </div>

          {/* Category and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-text-secondary">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-text">
                  <SelectItem value="social" className="hover:bg-[#4C69DD]/10">Social</SelectItem>
                  <SelectItem value="trip" className="hover:bg-[#4C69DD]/10">Trip</SelectItem>
                  <SelectItem value="cultural" className="hover:bg-[#4C69DD]/10">Cultural</SelectItem>
                  <SelectItem value="academic" className="hover:bg-[#4C69DD]/10">Academic</SelectItem>
                  <SelectItem value="sports" className="hover:bg-[#4C69DD]/10">Sports</SelectItem>
                  <SelectItem value="workshop" className="hover:bg-[#4C69DD]/10">Workshop</SelectItem>
                  <SelectItem value="party" className="hover:bg-[#4C69DD]/10">Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity" className="text-text-secondary">Maximum Capacity</Label>
              <Input id="capacity" type="number" min="1" placeholder="Number of attendees" />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event in detail. What should attendees expect? What should they bring?"
              className="min-h-[120px]"
            />
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-[#4C69DD]/10 text-[#4C69DD] hover:bg-[#4C69DD]/20 px-3 py-1">
                  {tag}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags (e.g. Hiking, Free Entry, Weekly)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">Press Enter to add a tag</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-primary text-white hover:bg-[#4C69DD]/90">Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
