"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Upload, FileText, Loader2 } from "lucide-react"
import { createThread, getThreads, getMessages, askCopilot, uploadDocument, getDocuments } from "../actions/rag"
import { useToast } from "@/hooks/use-toast"

export default function CopilotPage() {
  const [threads, setThreads] = useState<any[]>([])
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadThreads()
    loadDocuments()
  }, [])

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread)
    }
  }, [activeThread])

  async function loadThreads() {
    const data = await getThreads()
    setThreads(data)
    if (data.length > 0 && !activeThread) {
      setActiveThread(data[0].id)
    }
  }

  async function loadMessages(threadId: string) {
    const data = await getMessages(threadId)
    setMessages(data)
  }

  async function loadDocuments() {
    const data = await getDocuments()
    setDocs(data)
  }

  async function handleNewThread() {
    const thread = await createThread()
    setThreads([thread, ...threads])
    setActiveThread(thread.id)
    setMessages([])
  }

  async function handleSend() {
    if (!prompt.trim() || !activeThread) return

    setLoading(true)
    try {
      await askCopilot(activeThread, prompt)
      setPrompt("")
      await loadMessages(activeThread)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      await uploadDocument(formData)
      toast({
        title: "Document uploaded",
        description: "Processing and embedding document...",
      })
      await loadDocuments()
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Threads Sidebar */}
      <Card className="w-64 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
          <Button size="sm" onClick={handleNewThread}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)]">
          <div className="space-y-2">
            {threads.map((thread) => (
              <Button
                key={thread.id}
                variant={activeThread === thread.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveThread(thread.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="truncate">{thread.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">AI Copilot</h1>
          <p className="text-sm text-muted-foreground">Ask questions about your documents and data</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.tokens > 0 && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.tokens} tokens • ${msg.cost?.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={loading || !activeThread}
            />
            <Button onClick={handleSend} disabled={loading || !activeThread}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Documents Sidebar */}
      <Card className="w-64 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Documents</h2>
          <label>
            <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.txt,.doc,.docx" />
            <Button size="sm" asChild>
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)]">
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.status}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
