'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { MessageCircle, Plus, Send, User, Bot, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  _id: string
  sender: 'user' | 'support'
  text: string
  timestamp: string
}

interface ChatSession {
  _id: string
  subject: string
  status: 'active' | 'resolved' | 'closed'
  lastMessage: string
  lastMessageAt: string
  unread: number
  messages: Message[]
}

const mockSessions: ChatSession[] = [
  {
    _id: '1',
    subject: 'Order #ORD-12345 issue',
    status: 'active',
    lastMessage: 'Let me check with the agent.',
    lastMessageAt: '2026-03-15T14:30:00Z',
    unread: 2,
    messages: [
      { _id: 'm1', sender: 'user', text: 'Hi, I have an issue with my order #ORD-12345. The OTP was not delivered.', timestamp: '2026-03-15T14:00:00Z' },
      { _id: 'm2', sender: 'support', text: 'Hello! I am sorry to hear that. Let me look into your order. Could you please confirm your phone number?', timestamp: '2026-03-15T14:05:00Z' },
      { _id: 'm3', sender: 'user', text: 'Yes, it is +91 98765 43210', timestamp: '2026-03-15T14:10:00Z' },
      { _id: 'm4', sender: 'support', text: 'Thank you. I can see the order details now. Let me check with the agent handling your number.', timestamp: '2026-03-15T14:15:00Z' },
      { _id: 'm5', sender: 'user', text: 'Okay, how long will it take?', timestamp: '2026-03-15T14:20:00Z' },
      { _id: 'm6', sender: 'support', text: 'Let me check with the agent.', timestamp: '2026-03-15T14:30:00Z' },
    ],
  },
  {
    _id: '2',
    subject: 'Wallet deposit not reflecting',
    status: 'active',
    lastMessage: 'Please share the transaction ID.',
    lastMessageAt: '2026-03-14T11:00:00Z',
    unread: 0,
    messages: [
      { _id: 'm7', sender: 'user', text: 'I deposited Rs. 500 but it is not showing in my wallet.', timestamp: '2026-03-14T10:30:00Z' },
      { _id: 'm8', sender: 'support', text: 'Please share the transaction ID.', timestamp: '2026-03-14T11:00:00Z' },
    ],
  },
  {
    _id: '3',
    subject: 'How to change my password?',
    status: 'resolved',
    lastMessage: 'Glad I could help!',
    lastMessageAt: '2026-03-10T09:00:00Z',
    unread: 0,
    messages: [
      { _id: 'm9', sender: 'user', text: 'How do I change my password?', timestamp: '2026-03-10T08:30:00Z' },
      { _id: 'm10', sender: 'support', text: 'Go to Profile > Settings > Change Password. You will need your current password.', timestamp: '2026-03-10T08:45:00Z' },
      { _id: 'm11', sender: 'user', text: 'Got it, thanks!', timestamp: '2026-03-10T09:00:00Z' },
      { _id: 'm12', sender: 'support', text: 'Glad I could help!', timestamp: '2026-03-10T09:00:00Z' },
    ],
  },
]

export default function ChatPage() {
  const [isLoading] = useState(false)
  const [sessions] = useState<ChatSession[]>(mockSessions)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeSession = sessions.find((s) => s._id === activeSessionId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!activeSessionId) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 500))
    setSending(false)
    setInput('')
    toast.success('Message sent')
  }

  const handleNewChat = () => {
    toast.success('New chat session created')
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
          <p className="text-sm text-gray-500 mt-1">Chat with our support team</p>
        </div>
        <Button onClick={handleNewChat}>
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chat Sessions</CardTitle>
              <CardDescription>{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {sessions.length > 0 ? (
                <div className="divide-y">
                  {sessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => setActiveSessionId(session._id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        activeSessionId === session._id ? 'bg-primary-50 border-l-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{session.subject}</p>
                            {session.unread > 0 && (
                              <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-xs font-medium text-white">
                                {session.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{session.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(session.lastMessageAt, 'relative')}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8 px-4">
                  No chat sessions yet. Start a new conversation!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {activeSession ? (
            <Card className="flex flex-col h-[600px]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeSession.subject}</CardTitle>
                    <CardDescription>
                      Status: {activeSession.status}
                    </CardDescription>
                  </div>
                  {activeSession.status === 'active' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <Clock className="h-3 w-3" />
                      Active
                    </span>
                  )}
                  {activeSession.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeSession.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[75%] ${
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {msg.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            msg.sender === 'user'
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-gray-100 text-gray-900 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p
                          className={`text-xs text-gray-400 mt-1 ${
                            msg.sender === 'user' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {formatDate(msg.timestamp, 'relative')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} isLoading={sending} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[600px]">
                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-sm text-gray-500 mt-1">Choose a chat from the list or start a new one</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
