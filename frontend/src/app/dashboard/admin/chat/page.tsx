'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MessageCircle, Send, UserCheck, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const chats = [
  { _id: '1', user: 'Rahul Sharma', email: 'rahul@example.com', status: 'active', agent: '-', subject: 'OTP not received', lastMessage: 'Still waiting for the OTP...', unread: 3, timestamp: '2025-05-25T10:30:00' },
  { _id: '2', user: 'Priya Patel', email: 'priya@example.com', status: 'waiting', agent: '-', subject: 'Payment issue', lastMessage: 'My payment went through but order is pending', unread: 1, timestamp: '2025-05-25T09:15:00' },
  { _id: '3', user: 'Amit Singh', email: 'amit@example.com', status: 'active', agent: 'Support Agent 1', subject: 'Account verification', lastMessage: 'I have uploaded my documents', unread: 0, timestamp: '2025-05-24T18:45:00' },
  { _id: '4', user: 'Sneha Gupta', email: 'sneha@example.com', status: 'resolved', agent: 'Support Agent 2', subject: 'Order cancellation', lastMessage: 'Thank you for the help!', unread: 0, timestamp: '2025-05-24T14:20:00' },
  { _id: '5', user: 'Vikram Reddy', email: 'vikram@example.com', status: 'active', agent: '-', subject: 'API integration help', lastMessage: 'Can you guide me through the API docs?', unread: 2, timestamp: '2025-05-25T08:00:00' },
]

const sampleMessages = [
  { _id: 'm1', sender: 'user', text: 'Hello, I need help with my order.', time: '10:00 AM' },
  { _id: 'm2', sender: 'agent', text: 'Hi! I\'d be happy to help. What seems to be the issue?', time: '10:01 AM' },
  { _id: 'm3', sender: 'user', text: 'I placed an order but haven\'t received the OTP yet.', time: '10:03 AM' },
  { _id: 'm4', sender: 'agent', text: 'Let me check the status of your order. Could you share the order ID?', time: '10:05 AM' },
  { _id: 'm5', sender: 'user', text: 'Still waiting for the OTP...', time: '10:30 AM' },
]

const agents = ['Support Agent 1', 'Support Agent 2', 'Support Agent 3']

export default function AdminChatPage() {
  const [chatList] = useState(chats)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messages] = useState(sampleMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showAssign, setShowAssign] = useState(false)

  const filtered = chatList.filter(c =>
    c.user.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  ).filter(c => !statusFilter || c.status === statusFilter)

  const handleAssign = (agent: string) => {
    toast.success(`Chat assigned to ${agent}`)
    setShowAssign(false)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    toast.success('Message sent')
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
        <p className="text-sm text-gray-500 mt-1">Manage customer support conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search chats..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select options={[
              { value: '', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'waiting', label: 'Waiting' },
              { value: 'resolved', label: 'Resolved' },
            ]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-28" />
          </div>

          <div className="space-y-2">
            {filtered.map(chat => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full text-left rounded-lg border p-3 transition-colors hover:bg-gray-50 ${selectedChat?._id === chat._id ? 'border-primary bg-primary-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary-100 p-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{chat.user}</p>
                      <p className="text-xs text-gray-500 truncate">{chat.subject}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span className="text-xs text-gray-400">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-xs font-medium text-white">{chat.unread}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={chat.status} />
                  {chat.agent !== '-' && <span className="text-xs text-gray-400">{chat.agent}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedChat ? (
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{selectedChat.user}</h3>
                    <p className="text-xs text-gray-500">{selectedChat.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedChat.status} />
                    <Button variant="outline" size="sm" onClick={() => setShowAssign(true)}>
                      <UserCheck className="h-4 w-4 mr-1" /> Assign
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg._id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'agent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-primary-100' : 'text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent>
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a chat to view messages</p>
                  <p className="text-sm text-gray-400 mt-1">Use the API to connect this page.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAssign(false)}>
          <div className="w-full max-w-sm mx-4 rounded-lg border bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Assign Agent</h2>
            </div>
            <div className="p-6 space-y-3">
              {agents.map(agent => (
                <button
                  key={agent}
                  onClick={() => handleAssign(agent)}
                  className="w-full text-left rounded-lg border p-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  {agent}
                </button>
              ))}
              <Button variant="outline" className="w-full" onClick={() => setShowAssign(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
