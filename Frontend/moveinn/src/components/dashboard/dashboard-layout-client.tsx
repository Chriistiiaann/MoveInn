"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MenuIcon,
  HomeIcon,
  CalendarIcon,
  MessageCircleIcon,
  BookmarkIcon,
  MapPinIcon,
  UserIcon,
  GlobeIcon,
  SofaIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  ShieldIcon,
  BookUserIcon,
  UsersIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/authcontext"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const baseNav = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "Housing", href: "/dashboard/housing", icon: SofaIcon },
    { label: "Events", href: "/dashboard/events", icon: CalendarIcon },
    { label: "Messages", href: "/dashboard/messages", icon: MessageCircleIcon, badge: 12 },
    { label: "Forums", href: "/dashboard/forums", icon: BookmarkIcon },
    { label: "Recommendations", href: "/dashboard/recommendations", icon: MapPinIcon, badge: "New" },
    { label: "Hosts", href: "/dashboard/hosts", icon: UsersIcon },
    { label: "Find People", href: "/dashboard/findpeople", icon: BookUserIcon },
  ]

  const adminNav = { label: "Admin", href: "/dashboard/admin", icon: ShieldIcon }

  const mainNav = user?.role === 0 ? [...baseNav, adminNav] : baseNav

  const currentNavItem =
    [...mainNav]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href)) || { label: "Dashboard", icon: HomeIcon }

  const Icon = currentNavItem.icon

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 0:
        return (
          <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full shadow-sm border border-yellow-200">
            Administrator
          </span>
        )
      case 1:
        return (
          <span className="text-xs font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full shadow-sm border border-red-200">
            Banned
          </span>
        )
      case 2:
        return (
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full shadow-sm border border-blue-200">
            User
          </span>
        )
      case 3:
        return (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full shadow-sm border border-green-200">
            Host
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-foreground to-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full pt-16 transition-all duration-300 transform bg-foreground border-r border-gray-200 dark:border-gray-800",
          sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-16 flex items-center px-4 border-gray-200 bg-none z-50">
          <span className="text-4xl font-bold text-primary-dark tracking-wide">
            Move<span className="text-secondary-greenblue dark:text-secondary">Inn</span>
          </span>
        </div>
        <ScrollArea className="h-full px-3 py-4 pb-24">
          <nav className="space-y-1">
            {baseNav.map(({ label, href, icon: Icon, badge }) => (
              <SidebarItem
                key={label}
                href={href}
                icon={<Icon className="h-5 w-5" />}
                label={label}
                badge={badge}
              />
            ))}

            {user?.role === 0 && (
              <>
                <div className="pt-0 mt-2 border-none" />
                <SidebarItem
                  href={adminNav.href}
                  icon={<adminNav.icon className="h-5 w-5" />}
                  label={adminNav.label}
                />
              </>
            )}

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-full justify-start text-text-secondary hover:bg-secondary/15 hover:text-primary-dark"
              >
                {theme === "light" ? (
                  <MoonIcon className="h-5 w-5 mr-3" />
                ) : (
                  <SunIcon className="h-5 w-5 mr-3" />
                )}
                Toggle Theme
              </Button>
            </div>
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="absolute bottom-20 left-0 w-full px-3 py-2 bg-none">
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant="default"
            className="w-full bg-foreground justify-start text-red-600 dark:text-red-300 border-red-200 hover:bg-red-200/70 dark:hover:bg-red-500/70"
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 w-full px-3 py-4 border-t border-gray-200 dark:border-gray-700 bg-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={`${API_BASE_IMAGE_URL}${user?.avatarUrl}`}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">{user?.name}</span>
                <span className="text-xs text-text-secondary">{getRoleBadge(user?.role)}</span>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="text-primary-dark hover:bg-accent-light/30">
                <UserIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-foreground rounded-lg shadow-lg w-[90%] max-w-sm p-6">
              <h2 className="text-lg font-semibold text-primary-dark mb-2">Confirm Logout</h2>
              <p className="text-sm text-text-secondary mb-4">Are you sure you want to log out?</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="bg-foreground text-primary-dark hover:bg-gray-400"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    logout()
                    setShowLogoutModal(false)
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar (mobile only) */}
        <div className="p-4 bg-background dark:bg-foreground shadow lg:hidden flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="h-6 w-6 text-text" />
          </Button>
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-text" />
            <span className="text-lg font-semibold text-text">{currentNavItem.label}</span>
          </div>
        </div>

        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

function SidebarItem({
  href,
  icon,
  label,
  badge,
}: {
  href: string
  icon: React.ReactNode
  label: string
  badge?: string | number
}) {
  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-3 py-2 h-auto text-text-secondary hover:bg-secondary/15 hover:text-primary-dark"
        )}
      >
        <span className="flex items-center">
          {icon}
          <span className="ml-3">{label}</span>
        </span>
        {badge && (
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
              typeof badge === "number"
                ? "bg-primary text-white"
                : badge === "New"
                ? "bg-accent-light text-accent-dark"
                : "bg-secondary-greenblue text-primary-dark"
            )}
          >
            {badge}
          </span>
        )}
      </Button>
    </Link>
  )
}
