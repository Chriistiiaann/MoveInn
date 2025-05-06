"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useAuth } from "@/context/authcontext"
import { useWebsocket } from "@/context/WebSocketContext"
import type { Contact } from "@/components/messages/UseContact"
import { Check, CheckCheck, Send, Paperclip, Smile } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  content: string
  sentAt: string
  status: "not_received" | "delivered" | "read"
  senderName?: string | null
}

interface ChatWindowProps {
  contact: Contact | null
  onSend: (content: string) => void
}

export function ChatWindow({ contact, onSend }: ChatWindowProps) {
  const { user, token } = useAuth()
  const { lastMessage, markAsRead } = useWebsocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  // Helper para fecha
  const formatDateLabel = (iso: string) => {
    const d = new Date(iso),
      today = new Date(),
      yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    if (sameDay(d, today)) return "Hoy"
    if (sameDay(d, yesterday)) return "Ayer"
    return d.toLocaleDateString()
  }

  // 1️⃣ Historial
  useEffect(() => {
    if (!contact || !user?.id || !token) return
    ;(async () => {
      try {
        const { data } = await axios.get<ChatMessage[]>("https://localhost:7023/api/Chat/history", {
          params: { userId: user.id, contactId: contact.otherUserId },
          headers: { Authorization: `Bearer ${token}` },
        })
        setMessages(data.map((m) => ({ ...m, status: m.status ?? "delivered" })))
        markAsRead(contact.otherUserId)
      } catch {
        setMessages([])
      }
    })()
  }, [contact, user, token])

  // 2️⃣ New message
  useEffect(() => {
    if (
      contact &&
      lastMessage?.action === "new_message" &&
      lastMessage.receiverId === user?.id &&
      lastMessage.senderId === contact.otherUserId
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: lastMessage.messageId,
          senderId: lastMessage.senderId,
          content: lastMessage.content,
          sentAt: lastMessage.sentAt,
          status: "delivered",
          senderName: lastMessage.senderName,
        },
      ])
      markAsRead(contact.otherUserId)
    }
  }, [lastMessage, contact, user])

  // 3️⃣ Status update
  useEffect(() => {
    if (lastMessage?.action === "message_status") {
      const { messageId, status } = lastMessage
      setMessages((prev) => {
        if (status === "read") {
          return prev.map((m) =>
            m.senderId === user?.id ? { ...m, status: "read", id: m.id === messageId ? messageId : m.id } : m,
          )
        }
        let found = false
        const byId = prev.map((m) => (m.id === messageId ? ((found = true), { ...m, status }) : m))
        if (found) return byId
        let assigned = false
        return byId.map((m) =>
          !assigned && m.status === "not_received" ? ((assigned = true), { ...m, id: messageId, status }) : m,
        )
      })
    }
  }, [lastMessage, user])

  // 4️⃣ Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || !contact) return
    onSend(input.trim())
    const tempId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: user!.id,
        content: input.trim(),
        sentAt: new Date().toISOString(),
        status: "not_received",
        senderName: null,
      },
    ])
    setInput("")
  }

  if (!contact) return <div className="p-4">Selecciona una conversación.</div>

  // Render con separadores
  let lastDateLabel = ""
  return (
    <div className="flex-1 flex flex-col">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((m) => {
          const dateLabel = formatDateLabel(m.sentAt)
          const showSeparator = dateLabel !== lastDateLabel
          lastDateLabel = dateLabel
          const isMine = m.senderName === null || m.senderId === user!.id
          const time = new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

          return (
            <React.Fragment key={m.id}>
              {showSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-[#fcf3cc] text-[#ffbf00] px-3 py-1 rounded-full text-sm">{dateLabel}</div>
                </div>
              )}
              {/* Render message bubble without avatar */}
              <div className={`flex ${isMine ? "justify-end" : ""} mb-4`}>
                <div className={`flex flex-col max-w-[75%]`}>
                  <div
                    className={`${isMine ? "bg-[#5268d6]/30" : "bg-[#b7f8c8]/70"} px-4 py-2 rounded-2xl text-[#121e3e]`}
                  >
                    {m.content}
                  </div>
                  <div className={`flex items-center mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                    <span className="text-xs text-[#4d5562]">{time}</span>
                    {isMine && m.status === "read" && <CheckCheck className="h-3 w-3 text-blue-500 ml-1" />}
                    {isMine && m.status === "delivered" && <CheckCheck className="h-3 w-3 text-gray-500 ml-1" />}
                    {isMine && m.status === "not_received" && <Check className="h-3 w-3 text-gray-500 ml-1" />}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="p-4 bg-[#5268d6] rounded-lg my-4 mx-4"
      >
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
          <Smile className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 outline-none text-[#121e3e]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Paperclip className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          <button type="submit" className="bg-[#b7f8c8] p-2 rounded-full" disabled={!input.trim()}>
            <Send className="h-5 w-5 text-[#121e3e]" />
          </button>
        </div>
      </form>
    </div>
  )
}
