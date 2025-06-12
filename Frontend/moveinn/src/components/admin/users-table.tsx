"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_GET_ALL_USERS } from "@/utils/endpoints/config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface User {
  id: string
  name: string
  lastName: string
  mail: string
  role: number
  biography: string
  avatarUrl: string
  school: string
  city: string
  degree: string
  nationality: string
  erasmusDate: number
  erasmusCountry: string
  phone: string
}

interface UsersTableProps {
  renderRoleBadge: (role: number, userId: string) => React.ReactNode;
}


export function UsersTable({ renderRoleBadge }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get<User[]>(API_GET_ALL_USERS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      }
    }

    fetchUsers()
  }, [])

  return (
    <Card className="bg-foreground border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-text">User List</CardTitle>
        <CardDescription className="text-text-secondary">
          Manage user roles and view details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text">
            <thead>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Erasmus Country</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Biography</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-accent/10"
                >
                  <td className="px-4 py-3 font-medium">{u.name} {u.lastName}</td>
                  <td className="px-4 py-3">{u.mail}</td>
                  <td className="px-4 py-3">{u.city}</td>
                  <td className="px-4 py-3">{u.erasmusCountry}</td>
                  <td className="px-4 py-3">{u.phone}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{u.biography}</td>
                  <td className="px-4 py-3">
                    {renderRoleBadge(u.role, u.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
