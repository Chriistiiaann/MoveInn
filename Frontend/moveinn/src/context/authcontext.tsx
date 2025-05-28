"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, type JSX } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import {
  API_GET_USER,
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_UPDATE_SOCIALMEDIA,
  API_UPDATE_USER,
} from "@/utils/endpoints/config"
import { useRouter } from "next/navigation"
import type { DecodedToken, User, UserUpdateFormData } from "@/types/user"
import { setCookie, deleteCookie } from "cookies-next";


interface AuthContextType {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (mail: string, password: string, rememberMe: boolean) => Promise<void>
  register: (name: string, mail: string, password: string, phone: string) => Promise<void>
  logout: () => void
  error: string | null
  isLoading: boolean
  updateUserProfile: (userData: UserUpdateFormData) => Promise<User>
  updateSocialMedia: (socialMedias: Array<{ id: number; socialMedia: number; url: string }>) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  const extractUserId = (accessToken: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken)
      return decoded.id || null
    } catch (error) {
      console.error("Error decodificando token:", error)
      setError("Error decodificando token")
      return null
    }
  }

  const updateUserFromToken = async (accessToken: string) => {
    try {
      const userId = extractUserId(accessToken)
      if (!userId) throw new Error("Token inválido: falta 'sub'")

      console.log("Actualizando usuario con token:", { userId })

      const response = await axios.get(API_GET_USER(userId), {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.status === 200 && response.data) {
        const userData = response.data

        setUser(userData)
        setIsAuthenticated(true)
        setToken(accessToken)
        console.log("Usuario actualizado correctamente:", userData)
      } else {
        throw new Error(`Error al obtener usuario: ${response.status}`)
      }
    } catch (error: any) {
      console.error("Error actualizando datos del usuario:", error)
      setError(error.response?.data?.message || error.message || "Error actualizando datos del usuario")
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem("accessToken")
      sessionStorage.removeItem("accessToken")
    }
  }

  const updateUserProfile = async (userData: UserUpdateFormData): Promise<User> => {
    if (!user?.id || !token) {
      throw new Error("No se puede actualizar el perfil: falta ID de usuario o token");
    }
  
    const formData = new FormData();
  
    formData.append("id", user.id);
    formData.append("name", userData.name);
    formData.append("lastName", userData.lastName);
    formData.append("mail", userData.email);
    formData.append("biography", userData.biography || "");
    formData.append("school", userData.school || "");
    formData.append("city", userData.city || "");
    formData.append("degree", userData.degree || "");
    formData.append("nationality", userData.nationality || "");
    formData.append("erasmusCountry", userData.erasmusCountry || "");
    if (userData.erasmusDate) formData.append("erasmusDate", userData.erasmusDate);
    formData.append("phone", userData.phone || "");
    if (userData.countryFlag) formData.append("countryFlag", userData.countryFlag);
    if (userData.erasmusCountryFlag) formData.append("erasmusCountryFlag", userData.erasmusCountryFlag);
    if (userData.avatarFile) formData.append("file", userData.avatarFile);
  
    try {
      const response = await axios.put(API_UPDATE_USER(user.id), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200 && response.data) {
        setUser(response.data);
      }
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al actualizar el perfil");
    }
  };
  

  const updateSocialMedia = async (socialMedias: Array<{ id: number; socialMedia: number; url: string }>) => {
    if (!user?.id || !token) {
      throw new Error("No se puede actualizar las redes sociales: falta ID de usuario o token")
    }

    try {
      const requestBody = {
        socialMedias: socialMedias,
      }

      console.log("Updating social media with data:", requestBody)

      const response = await axios.put(API_UPDATE_SOCIALMEDIA(user.id), requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 && response.data) {
        setUser((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            socialMedias: response.data,
          }
        })
      }

      return response.data
    } catch (error: any) {
      console.error("Error updating social media:", error)
      throw new Error(error.response?.data?.message || "Error al actualizar las redes sociales")
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")

        console.log("Token almacenado encontrado:", !!storedToken)

        if (storedToken) {
          await updateUserFromToken(storedToken)
        }
      } catch (error) {
        console.error("Error en la inicialización de auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    setIsAuthenticated(!!user && !!token)
  }, [user, token])

  const login = async (mail: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        API_AUTH_LOGIN,
        { mail, password },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
      const { accessToken } = response.data
      if (!accessToken) throw new Error("No se recibió accessToken en la respuesta")

      setCookie("token", accessToken, {
        maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 2, // 7 días o 2 horas
        path: "/",
      });

      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken)
      } else {
        sessionStorage.setItem("accessToken", accessToken)
      }
      setToken(accessToken)
      await updateUserFromToken(accessToken)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error en login:", error)
      setError(error.response?.data?.message || error.message || "Error de inicio de sesión.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, mail: string, password: string, phone: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        mail,
        password,
        name,
        phone: phone,
      }

      const response = await axios.post(API_AUTH_REGISTER, payload, {
        headers: { "Content-Type": "application/json" },
      })

      const { accessToken } = response.data
      localStorage.setItem("accessToken", accessToken)
      setToken(accessToken)

      const decoded: DecodedToken = jwtDecode(accessToken)
      setUser({
        id: decoded.id,
        mail: decoded.email,
        name: decoded.name,
        phone: phone.toString(),
      })

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data || "Error en el registro")
      console.error("Error en registro:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    deleteCookie("token")
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("accessToken")
    setUser(null)
    setToken(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        error,
        isLoading,
        updateUserProfile,
        updateSocialMedia,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
