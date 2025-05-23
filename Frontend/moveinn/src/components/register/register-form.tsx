"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react"
import { useAuth } from "@/context/authcontext"


export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const router = useRouter()
  const { register, isLoading, error } = useAuth()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const mail = formData.get("mail") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      return
    }
    setPasswordMatch(true)

    try {
      if (phone !== null) {
        await register(name, mail, password, phone)
      } else {
        console.error("Phone number is required and must be a valid number.")
      }
      router.push("/dashboard")
    } catch (err) {
      console.error("Error en registro:", err)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-text">Join </span>
          <span className="text-primary">Move</span>
          <span className="text-secondary">Inn</span>
          <span className="text-text"> Today</span>
        </h1>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-foreground shadow-sm">
        <h2 className="font-semibold text-text text-lg mb-1">Create your account</h2>
        <p className="text-sm text-gray-600 mb-4">Join the MoveInn community and start your Erasmus journey</p>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
        )}

        {!passwordMatch && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            Passwords do not match
          </div>
        )}

        <form className="space-y-3" onSubmit={handleRegister}>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-secondary"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">
              Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="phone"
                placeholder="655555555"
                className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-secondary"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="mail" className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="mail"
                name="mail"
                type="email"
                placeholder="your.email@gmail.com"
                className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-secondary"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-secondary"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-text-secondary"
                required
                minLength={8}
              />

              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mt-3"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-3 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
