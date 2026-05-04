import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Users as UsersIcon, 
  ShieldCheck, 
  Wrench, 
  Phone, 
  Video, 
  Info,
  Circle,
  MessageSquare
} from 'lucide-react'
import { mockChatThreads, mockMessages, users } from '../data'
import { useToast } from '../App'

export default function Chat() {
  const toast = useToast()
  const [activeThread, setActiveThread] = useState(mockChatThreads[0])
  const [messages, setMessages] = useState(mockMessages.filter(m => m.threadId === mockChatThreads[0].id))
  const [inputText, setInputText] = useState('')
  const [mounted, setMounted] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg = {
      id: Date.now(),
      threadId: activeThread.id,
      senderId: 12, // Logged in Admin
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages([...messages, newMsg])
    setInputText('')
    
    // Fake reply logic
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        threadId: activeThread.id,
        senderId: activeThread.members[0],
        text: 'Message received. We are processing your request.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }
      setMessages(prev => [...prev, reply])
    }, 1500)
  }

  const switchThread = (thread) => {
    setActiveThread(thread)
    setMessages(mockMessages.filter(m => m.threadId === thread.id))
  }

  if (!mounted) return null

  return (
    <div className="chat-container" style={{ 
      display: 'flex', 
      height: 'calc(100vh - 140px)', 
      background: 'white', 
      borderRadius: '32px', 
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      {/* Sidebar */}
      <div className="chat-sidebar" style={{ 
        width: '380px', 
        borderRight: '1px solid #f1f5f9', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 950, letterSpacing: '-1px', margin: '0 0 20px 0', color: '#0f172a' }}>Conversations</h2>
          <div className="search-input-wrap" style={{ background: '#f8fafc', borderRadius: '16px', padding: '12px 16px' }}>
            <Search size={18} color="#94a3b8" />
            <input placeholder="Search threads or people..." style={{ fontWeight: 600, fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {mockChatThreads.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => switchThread(thread)}
              style={{
                padding: '20px 24px',
                display: 'flex',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeThread.id === thread.id ? '#f8fafc' : 'transparent',
                borderLeft: `4px solid ${activeThread.id === thread.id ? thread.color : 'transparent'}`
              }}
            >
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '18px', 
                background: `${thread.color}15`, 
                color: thread.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {thread.type === 'Technical' ? <Wrench size={24} /> : <UsersIcon size={24} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{thread.time}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{thread.lastMsg}</div>
                  {thread.unread > 0 && (
                    <div style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      fontSize: '10px', 
                      fontWeight: 900, 
                      padding: '2px 8px', 
                      borderRadius: '8px' 
                    }}>{thread.unread}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fcfdfe' }}>
        {/* Header */}
        <div style={{ 
          padding: '24px 32px', 
          background: 'white', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '16px', 
              background: `${activeThread.color}15`, 
              color: activeThread.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeThread.type === 'Technical' ? <Wrench size={22} /> : <UsersIcon size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>{activeThread.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                <Circle size={8} fill="#10b981" /> Active Operational Channel
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-ghost" style={{ borderRadius: '12px' }}><Phone size={20} /></button>
            <button className="btn btn-ghost" style={{ borderRadius: '12px' }}><Video size={20} /></button>
            <button className="btn btn-ghost" style={{ borderRadius: '12px' }}><Info size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((msg, i) => {
              const sender = users.find(u => u.id === msg.senderId)
              return (
                <div key={msg.id} style={{ 
                  display: 'flex', 
                  justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                  gap: '12px',
                  animation: 'fadeInUp 0.3s ease-out'
                }}>
                  {!msg.isMe && (
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '12px', 
                      background: sender?.color || '#3b82f6', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 900,
                      alignSelf: 'flex-end'
                    }}>
                      {sender?.initials || '??'}
                    </div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    {!msg.isMe && <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', marginLeft: '4px' }}>{sender?.name}</div>}
                    <div style={{ 
                      padding: '16px 20px', 
                      borderRadius: msg.isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                      background: msg.isMe ? '#0f172a' : 'white',
                      color: msg.isMe ? 'white' : '#334155',
                      boxShadow: msg.isMe ? '0 10px 20px rgba(15, 23, 42, 0.1)' : '0 4px 15px rgba(0,0,0,0.03)',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      border: msg.isMe ? 'none' : '1px solid #f1f5f9'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#94a3b8', 
                      marginTop: '6px', 
                      textAlign: msg.isMe ? 'right' : 'left',
                      fontWeight: 700
                    }}>{msg.time}</div>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div style={{ padding: '24px 32px', background: 'white', borderTop: '1px solid #f1f5f9' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button type="button" className="btn btn-ghost" style={{ borderRadius: '12px' }}><Paperclip size={20} /></button>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type your strategic directive or message..." 
                style={{ 
                  width: '100%', 
                  height: '56px', 
                  borderRadius: '20px', 
                  border: '1px solid #e2e8f0', 
                  padding: '0 24px', 
                  fontSize: '15px', 
                  fontWeight: 600,
                  background: '#f8fafc'
                }} 
              />
            </div>
            <button 
              type="submit"
              className="btn btn-primary" 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '20px', 
                background: '#0f172a', 
                border: 'none',
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)'
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
