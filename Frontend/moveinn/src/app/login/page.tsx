"use client"

import { useAuth } from "@/context/authcontext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginForm from "@/components/login/login-form"
import { ThemeToggle } from "@/components/landing/theme-toggle-btn"
import { Users, Globe, MapPin, GraduationCap } from "lucide-react"

export default function LoginPage() {

  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/dashboard"
    }
  }, [isLoading, isAuthenticated])


  return (
    <main className="min-h-screen relative">
      {/* Botón de cambio de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
        
      </div>

      <div className="grid md:grid-cols-2 h-screen">
        <div className="flex items-center justify-center p-8">
          <LoginForm />
        </div>

        <div className="h-[95%] w-[95%] mx-auto my-auto 
          bg-gradient-to-br from-[#121E3E] via-[#5268D6] to-[#B7F8C8] dark:via-[#5268D6]/80 dark:to-foreground 
          rounded-[20px] flex items-center justify-center"
        >

          <div className="h-full flex flex-col justify-center p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-4">
                Move<span className="text-secondary">Inn</span>
              </h2>
              <p className="text-2xl font-medium">
                Connect with Erasmus students worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Community */}
                    <Users />
                  </div>
                  <h3 className="font-semibold">Community</h3>
                </div>
                <p className="text-sm">Join 5,000+ students</p>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Locations */}
                    <MapPin />
                  </div>
                  <h3 className="font-semibold">Locations</h3>
                </div>
                <p className="text-sm">Active in 30+ cities</p>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    {/* Icono Global */}
                    <Globe />
                  </div>
                  <h3 className="font-semibold">Global</h3>
                </div>
                <p className="text-sm">Students from 50+ countries</p>
              </div>

              {/* Puedes eliminar este div duplicado si fue por error */}
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2 text-white">
                    <GraduationCap />
                  </div>
                  <h3 className="font-semibold">Global</h3>
                </div>
                <p className="text-sm">Students from 50+ countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
