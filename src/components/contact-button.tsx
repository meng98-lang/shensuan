'use client'

import { useState } from 'react'

interface ContactButtonProps {
  contact: {
    id: string
    platform: string
    displayName: string
    link: string
    active: boolean
  }
  themeColor: string
}

export default function ContactButton({ contact, themeColor }: ContactButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    
    // 记录点击统计
    try {
      await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contact.id,
          platform: contact.platform,
          page: window.location.pathname
        })
      })
    } catch (error) {
      console.error('记录点击失败:', error)
    }
    
    setLoading(false)
  }

  const bgColor = contact.platform === 'line' ? '#06C755' : 
                  contact.platform === 'whatsapp' ? '#25D366' : 
                  contact.platform === 'telegram' ? '#0088cc' : 
                  contact.platform === 'wechat' ? '#07C160' : themeColor

  return (
    <a
      href={contact.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full py-4 px-6 rounded-full text-white text-center font-semibold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
      style={{ backgroundColor: bgColor }}
    >
      {contact.displayName}
      {loading && <span className="ml-2 text-xs">记录中...</span>}
    </a>
  )
}
