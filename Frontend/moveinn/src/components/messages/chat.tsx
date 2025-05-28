"use client"

import React, { useState, useEffect } from 'react'
import { useContacts, type Contact } from '@/components/messages/UseContact'
import { useWebsocket } from '@/context/WebSocketContext'
import { ContactsList } from '@/components/messages/ContactList'
import { ChatWindow } from '@/components/messages/ChatWindow'
import { User, Search, Menu, X } from 'lucide-react'

export default function MessagesPage() {
  const { contacts: initialContacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { lastMessage, sendMessage } = useWebsocket()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileContacts, setShowMobileContacts] = useState(false)

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
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0E1E40] via-[#4C69DD] to-[#62C3BA] dark:to-foreground rounded-xl mx-4 mt-4 mb-2 px-6 py-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7F8C8]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#62C3BA]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          {selected && (
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-green-200 rounded-full p-2">
                <User className="h-6 w-6 text-[#0E1E40]" />
              </div>
              <div className="text-right">
                <div className="font-semibold">{selected.otherUserName}</div>
                <div className="text-sm text-white/80">Online – just now</div>
              </div>
            </div>
          )}
          <button
            className="md:hidden p-2 rounded-full bg-background/10 hover:bg-background/20"
            onClick={() => setShowMobileContacts(true)}
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 mx-4 mb-4 overflow-hidden rounded-xl shadow-sm bg-foreground relative">
        {/* CONTACT LIST - DESKTOP */}
        <div className="hidden md:flex w-1/3 p-4 border-r border-border dark:border-gray-700 flex-col">
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

          {filteredContacts.length > 0 ? (
            <ContactsList
              contacts={filteredContacts}
              selectedContactId={selected?.otherUserId || null}
              onSelect={(c) => setSelected(c)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-500 text-center px-4">
              <p className="mb-2">You don’t have any contacts yet.</p>
              <p className="text-primary font-medium">Follow someone to start chatting!</p>
            </div>
          )}
        </div>

        {/* CONTACT LIST - MOBILE SLIDEOVER */}
        {showMobileContacts && (
          <div className="fixed inset-0 z-50 bg-black/50 flex md:hidden">
            <div className="w-3/4 bg-background h-full flex flex-col p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary dark:text-text-secondary">Chats</h2>
                <button
                  onClick={() => setShowMobileContacts(false)}
                  className="p-2 rounded-full hover:bg-red-400"
                >
                  <X className="h-5 w-5 text-text" />
                </button>
              </div>
              <div className="mb-4">
                <div className="bg-background border border-primary rounded-full px-4 py-2 flex items-center gap-2">
                  <Search className="h-4 w-4 text-text" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none text-sm text-text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {filteredContacts.length > 0 ? (
                <ContactsList
                  contacts={filteredContacts}
                  selectedContactId={selected?.otherUserId || null}
                  onSelect={(c) => {
                    setSelected(c)
                    setShowMobileContacts(false)
                  }}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-500 text-center px-4">
                  <p className="mb-2">You don’t have any contacts yet.</p>
                  <p className="text-primary font-medium">Follow someone to start chatting!</p>
                </div>
              )}
            </div>
            <div className="flex-1" onClick={() => setShowMobileContacts(false)} />
          </div>
        )}

        {/* CHAT */}
        <div className="flex-1 flex flex-col">
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
    </div>
  )
}
