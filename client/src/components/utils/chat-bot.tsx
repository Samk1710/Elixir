"use client"
import type React from "react"
import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "api/chat",
  })

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = document.querySelector('button[class*="fixed bottom-4 right-4"]')

      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(target) &&
        button &&
        !button.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleChat = () => setIsOpen(!isOpen)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  return (
    <>
      <Button
        size="lg"
        className={cn(
          "fixed bottom-4 right-4 rounded-full p-4 shadow-lg transition-transform hover:scale-105",
          isOpen && "rotate-90",
        )}
        onClick={toggleChat}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <div
        ref={chatContainerRef}
        className={cn(
          "fixed bottom-20 right-4 w-[340px] transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <Card className="shadow-xl border-2">
          <CardHeader className="border-b bg-muted/50 p-4">
            <CardTitle className="text-lg font-semibold">Elixir Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[380px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[85%] break-words",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2 bg-muted text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <form onSubmit={onSubmit}>
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

