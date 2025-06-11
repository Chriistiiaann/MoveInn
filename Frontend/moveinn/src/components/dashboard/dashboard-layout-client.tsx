"use client"

import { useAuth } from "@/context/authcontext"
import { AuthenticatedLayout } from "./authenticated-layout"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  console.log("🚦 Auth State", { isAuthenticated, isLoading })


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }
  
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-muted-foreground">No autorizado</p>
      </div>
    )
  }
  

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
