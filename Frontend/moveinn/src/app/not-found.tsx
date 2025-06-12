'use client'

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <div className="relative w-full max-w-xl rounded-xl bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground p-8 md:p-10 text-white shadow-lg text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-10 bg-repeat pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">Page Not Found</h1>
          <p className="text-white/80 mb-6">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          <Link href="/dashboard">
            <Button className="bg-[#FFBF00] text-[#0E1E40] hover:bg-[#FFBF00]/90 font-semibold">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
