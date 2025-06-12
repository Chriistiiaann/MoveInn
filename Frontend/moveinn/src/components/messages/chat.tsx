"use client"

import React, { useState, useEffect } from 'react'
import { useContacts, type Contact } from '@/components/messages/UseContact'
import { useWebsocket } from '@/context/WebSocketContext'
import { ContactsList } from '@/components/messages/ContactList'
import { ChatWindow } from '@/components/messages/ChatWindow'
import { User, Search, Menu, X } from 'lucide-react'
import { API_USER_FOLLOWERS } from "@/utils/endpoints/config"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/context/authcontext"


export default function MessagesPage() {
  const { contacts: initialContacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { lastMessage, sendMessage } = useWebsocket()
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileContacts, setShowMobileContacts] = useState(false)
  const [followersIds, setFollowersIds] = useState<string[]>([])

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!user?.id) return
  
      try {
        const response = await axios.get(API_USER_FOLLOWERS(user.id))
        const followerIds = response.data.map((f: any) => f.id) // ajusta si el ID viene como userId u otro campo
        setFollowersIds(followerIds)
      } catch (error) {
        console.error("Error loading followers:", error)
      }
    }
  
    fetchFollowers()
  }, [user?.id])
  

  useEffect(() => {
    setContacts(initialContacts)
    if (initialContacts.length > 0) {
      setSelected(prev => prev ?? initialContacts[0])
    }
  }, [initialContacts])

  const handleLocalSend = (receiverId: string, content: string) => {
    setContacts(prev =>
      prev.map(c =>
        c.otherUserId === receiverId
          ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
          : c
      )
    )
    sendMessage(receiverId, content)
  }

  useEffect(() => {
    if (!lastMessage) return
    setContacts(prev =>
      prev.map(c => {
        if (lastMessage.action === 'new_message' && lastMessage.senderId === c.otherUserId) {
          return { ...c, lastMessage: lastMessage.content, lastMessageAt: lastMessage.sentAt }
        }
        if (lastMessage.action === 'message_status' && lastMessage.receiverId === c.otherUserId) {
          return { ...c, lastMessageAt: new Date().toISOString() }
        }
        return c
      })
    )
  }, [lastMessage])

  if (contactsLoading) return <div className="p-4">Loading contacts…</div>
  if (contactsError) return <div className="p-4">Error loading contacts.</div>

  const filteredContacts = contacts.filter(c =>
    c.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl w-full mt-4 mb-2 px-4 md:px-6 py-4 text-white relative overflow-hidden">

      <div className="relative z-10 flex items-center justify-between w-full">
  {/* Botón hamburguesa a la izquierda (solo en mobile) */}
  <button
    className="md:hidden p-2 rounded-full bg-background/10 hover:bg-background/20"
    onClick={() => setShowMobileContacts(true)}
  >
    <Menu className="h-6 w-6 text-white" />
  </button>

  {/* Título solo en desktop */}
  <h1 className="text-2xl font-bold hidden md:block">Messages</h1>

  {/* Contacto seleccionado */}
  {selected && (
    <div className="flex items-center gap-3 ml-auto">
      <div className="bg-green-200 rounded-full p-2">
        <User className="h-6 w-6 text-[#0E1E40]" />
      </div>
      <div className="text-right">
        <div className="font-semibold">{selected.otherUserName}</div>
        {/* <div className="text-sm text-white/80 hidden md:block">Online – just now</div> */}
      </div>
    </div>
  )}
</div>

      </div>
  
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full mb-4 rounded-xl shadow-sm bg-foreground overflow-hidden">
        {/* CONTACT LIST - DESKTOP */}
        <div className="hidden md:flex w-1/3 min-w-0 flex-col p-4 border-r border-border dark:border-gray-700 overflow-y-auto">
          {/* Search bar */}
          <div className="mb-4">
            <div className="bg-background border border-primary rounded-full px-4 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-text" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="flex-1 bg-transparent outline-none text-sm text-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* Contact list */}
          {filteredContacts.length > 0 ? (
            <ContactsList
            contacts={filteredContacts}
            selectedContactId={selected?.otherUserId || null}
            followersIds={followersIds}
            onSelect={(c) => {
              if (followersIds.includes(c.otherUserId)) {
                setSelected(c)
              } else {
                toast.warning(`Wait until ${c.otherUserName} follows you to start a conversation`)
              }
            }}
          />
          
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-sm text-text text-center px-4">
              <p className="mb-2">You don’t have any contacts yet.</p>
              <p className="text-primary dark:text-text-secondary font-medium">Follow someone to start chatting!</p>
            </div>
          )}
        </div>
  
        {/* CHAT */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {selected ? (
            <ChatWindow
              contact={selected}
              onSend={(content) => handleLocalSend(selected.otherUserId, content)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
      {/* CONTACT LIST - MOBILE */}
{showMobileContacts && (
  <div className="fixed inset-0 z-50 bg-background text-text flex flex-col md:hidden">
    <div className="flex items-center justify-between p-4 border-b border-border">
      <h2 className="text-lg font-semibold">Contacts</h2>
      <button onClick={() => setShowMobileContacts(false)}>
        <X className="h-6 w-6" />
      </button>
    </div>
    <div className="p-4">
      <div className="bg-background border border-primary rounded-full px-4 py-2 flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-text" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="flex-1 bg-transparent outline-none text-sm text-text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ContactsList
        contacts={filteredContacts}
        selectedContactId={selected?.otherUserId || null}
        followersIds={followersIds}
        onSelect={(c) => {
          if (followersIds.includes(c.otherUserId)) {
            setSelected(c)
            setShowMobileContacts(false)
          } else {
            toast.warning(`Wait until ${c.otherUserName} follows you to start a conversation`)
          }
        }}
      />
    </div>
  </div>
)}

    </div>
  )
}
