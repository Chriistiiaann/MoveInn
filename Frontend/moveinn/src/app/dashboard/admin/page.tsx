"use client";

import {
  UsersIcon,
  Settings2Icon,
  UserCogIcon,
  ActivityIcon,
  PencilIcon,
} from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_GET_ALL_USERS, API_GET_HOSTS, API_ADMIN_MODIFY_ROLE_USER } from "@/utils/endpoints/config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HostRequests } from "@/components/admin/host-requests";
import { HostsTable } from "@/components/admin/hosts-table";
import { UsersTable } from "@/components/admin/users-table";
import { RecommendationsTable } from "@/components/admin/recommendations-table"
import { EventsTable } from "@/components/admin/events-table"
import { AccommodationsTable } from "@/components/admin/accommodations-table";

import { toast } from "sonner";

import { getCookie } from "cookies-next";
import { ReviewsTable } from "@/components/admin/reviews-table";


interface User {
  id: string;
  name: string;
  lastName: string;
  mail: string;
  role: number;
  biography: string;
  avatarUrl: string;
  school: string;
  city: string;
  degree: string;
  nationality: string;
  erasmusDate: number;
  erasmusCountry: string;
  phone: string;
}


interface RoleBadgeProps {
  role: number;
  userId: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hosts, setHosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 0) {
      router.push("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    const fetchUsersAndHosts = async () => {
      try {
        const token = getCookie("token");
  
        const [usersRes, hostsRes] = await Promise.all([
          axios.get(API_GET_ALL_USERS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_GET_HOSTS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
  
        setUsers(usersRes.data)
        setHosts(hostsRes.data)
      } catch (error) {
        console.error("Error fetching users or hosts:", error)
        setUsers([])
        setHosts([])
      }
    }
  
    fetchUsersAndHosts()
  }, [])
  

  if (!user || user.role !== 0) return null;

  function handleEditClick(user: User) {
    setSelectedUser(user);
    setEditModalOpen(true);
  }

  return (
    <div className="min-h-screen px-4 py-8 space-y-8">
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-foreground rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold text-text mb-4">Edit User</h2>
            <form className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-text mb-1">Name</label>
                <input
                    type="text"
                    defaultValue={selectedUser.name}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-text mb-1">Last Name</label>
                <input
                    type="text"
                    defaultValue={selectedUser.lastName}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-text mb-1">Email</label>
                <input
                    type="email"
                    defaultValue={selectedUser.mail}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-text mb-1">Biography</label>
                <textarea
                    defaultValue={selectedUser.biography}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-text bg-background resize-none"
                />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                <Button
                    variant="ghost"
                    onClick={() => setEditModalOpen(false)}
                    className="text-text-secondary hover:text-text"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() => {
                    // Aquí iría el update al backend
                    setEditModalOpen(false);
                    }}
                >
                    Save
                </Button>
                </div>
            </form>

            <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
                ✕
            </button>
            </div>
        </div>
        )}

      <div className="container mx-auto py-8 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/80">Welcome, <span className="font-semibold text-accent">{user.name}</span>. Here's an overview of the platform.</p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-foreground border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <UsersIcon className="h-5 w-5 text-secondary-greenblue dark:text-secondary" />
                Total Users
              </CardTitle>
              <CardDescription className="text-text-secondary">Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-text">{users.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-foreground border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text">
              <UserCogIcon className="h-5 w-5 text-secondary-greenblue dark:text-secondary" />
              Hosts
            </CardTitle>
            <CardDescription className="text-text-secondary">Approve or remove host accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text">{hosts.length}</p>
          </CardContent>
        </Card>
        </section>

        
        {/* Admin Tabs */}
        <section>
          <Tabs defaultValue="users" className="space-y-4">
          <div className="w-full flex justify-center">
  <TabsList className="flex flex-wrap md:flex-nowrap md:justify-center overflow-x-auto gap-2 p-1 bg-foreground rounded-lg">
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="users">
      Users
    </TabsTrigger>
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="recommendations">
      Recommendations
    </TabsTrigger>
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="events">
      Events
    </TabsTrigger>
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="housing">
      Housing
    </TabsTrigger>
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="reviews">
      Reviews
    </TabsTrigger>
    <TabsTrigger className="text-text min-w-[130px] text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:rounded-lg" value="hosts">
      Hosts
    </TabsTrigger>
  </TabsList>
</div>


            <TabsContent value="users">
              <UsersTable renderRoleBadge={(role, userId) => <RoleBadge role={role} userId={userId} />} />
            </TabsContent>

            <TabsContent value="recommendations">
              <RecommendationsTable />
            </TabsContent>
            <TabsContent value="events">
              <EventsTable />
            </TabsContent>
            <TabsContent value="housing">
              <AccommodationsTable />
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewsTable />
            </TabsContent>
            <TabsContent value="hosts" className="space-y-4">
              <Card className="bg-foreground border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-text">Host Requests</CardTitle>
                  <CardDescription className="text-text-secondary">
                    Review and manage incoming host requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HostRequests setHosts={setHosts} />
                </CardContent>
              </Card>
              <Card className="bg-foreground border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-text">All Hosts</CardTitle>
                  <CardDescription className="text-text-secondary">
                    Review and manage all hosts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HostsTable hosts={hosts} setHosts={setHosts} />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </section>
      </div>
    </div>
  );
}

export function RoleBadge({ role, userId }: RoleBadgeProps) {
  const [showSelect, setShowSelect] = useState(false);
  const [currentRole, setCurrentRole] = useState(role);

  const { user } = useAuth();

  const roleOptions = [
    { id: 0, label: "Administrator", className: "text-yellow-600 bg-yellow-100 border-yellow-200" },
    { id: 1, label: "Banned", className: "text-red-600 bg-red-100 border-red-200" },
    { id: 2, label: "User", className: "text-blue-600 bg-blue-100 border-blue-200" },
  ];

  const selected = roleOptions.find((r) => r.id === currentRole);

  const handleRoleChange = async (newRole: number) => {
    try {
      const token = getCookie("token");

      if (token) {
        console.log("Token desde cookie:", token);
      }
      console.log("token", token);
      await axios.put(API_ADMIN_MODIFY_ROLE_USER(userId, newRole), null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentRole(newRole);

      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    } finally {
      setShowSelect(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowSelect(!showSelect)}
        className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm border transition-colors
          ${selected?.className || "text-gray-600 bg-gray-100 border-gray-200"}`}
      >
        {selected?.label || "Unknown"}
      </button>

      {showSelect && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-background border rounded-md shadow-md w-36 overflow-hidden">
          {roleOptions.map((r, index) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`block w-full text-left text-sm px-4 py-2 hover:bg-accent/20
                ${r.className}
                ${index === 0 ? "rounded-t-md" : ""}
                ${index === roleOptions.length - 1 ? "rounded-b-md border-t" : "border-t"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
