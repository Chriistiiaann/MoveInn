"use client"
import Image from "next/image"
import type { Contact } from "@/components/messages/UseContact"
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config"

interface ContactsListProps {
  contacts: Contact[]
  selectedContactId: string | null
  onSelect: (contact: Contact) => void
  followersIds: string[]
}

export function ContactsList({ contacts, selectedContactId, onSelect, followersIds }: ContactsListProps) {

  return (
    <div className="flex-1 overflow-y-auto">
      {contacts.map((c) => {
        const isSelected = c.otherUserId === selectedContactId
        const avatarSrc = c.otherUserAvatar?.startsWith("http") ? c.otherUserAvatar : "/avatars/default.png"

        const isDisabled = !followersIds.includes(c.otherUserId)

        return (
          <div
            key={c.otherUserId}
            className={`py-3 px-3 flex items-center gap-3 transition-all duration-200
              ${isDisabled ? "opacity-50" : "cursor-pointer"}
              ${
                isSelected
                  ? "bg-gradient-to-r from-foreground/5 to-accent/20 rounded-lg border-r-3 border-accent"
                  : "hover:bg-gradient-to-r hover:from-foreground hover:to-gray-100 dark:hover:from-foreground dark:hover:to-gray-900/30 rounded-lg border-none"
              }`}
            onClick={() => onSelect(c)}
            
          >
            {c.otherUserAvatar?.includes("default-avatar") ? (
  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
    {c.otherUserName?.charAt(0).toUpperCase() ?? "?"}
  </div>
) : (
  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
    <Image
      src={API_BASE_IMAGE_URL + c.otherUserAvatar}
      alt={c.otherUserName}
      width={40}
      height={40}
      className="w-full h-full object-cover rounded-full"
      unoptimized
    />
  </div>
)}


            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <div className="font-medium text-primary dark:text-text-secondary truncate">{c.otherUserName}</div>
                <div className="text-xs text-gray-700 dark:text-gray-200">
                  {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{c.lastMessage}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
