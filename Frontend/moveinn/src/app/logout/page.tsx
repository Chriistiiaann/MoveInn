"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/authcontext"

export default function LogoutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [])

  return null
}
