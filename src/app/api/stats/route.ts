import { NextResponse } from 'next/server'
import { readData } from '@/lib/db'

export async function GET() {
  try {
    const data = await readData<{ clicks: Array<{ id: string; contactId: string; platform: string; page: string; timestamp: string; ip: string }> }>('clicks.json')
    const contacts = await readData<{ contacts: Array<{ id: string; platform: string; name: string; link: string; active: boolean }> }>('contacts.json')

    // 按联系方式分组统计
    const stats = contacts.contacts.map(contact => {
      const contactClicks = data.clicks.filter(c => c.contactId === contact.id)
      const today = new Date().toISOString().split('T')[0]
      const todayClicks = contactClicks.filter(c => c.timestamp.startsWith(today))
      
      // 最近 7 天统计
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const weekClicks = contactClicks.filter(c => c.timestamp >= sevenDaysAgo)

      return {
        contactId: contact.id,
        platform: contact.platform,
        name: contact.name,
        totalClicks: contactClicks.length,
        todayClicks: todayClicks.length,
        weekClicks: weekClicks.length,
        lastClick: contactClicks.length > 0 ? contactClicks[contactClicks.length - 1].timestamp : null
      }
    })

    // 总体统计
    const totalClicks = data.clicks.length
    const today = new Date().toISOString().split('T')[0]
    const todayClicks = data.clicks.filter(c => c.timestamp.startsWith(today)).length

    return NextResponse.json({
      success: true,
      stats,
      summary: {
        totalClicks,
        todayClicks,
        totalContacts: contacts.contacts.filter(c => c.active).length
      }
    })
  } catch (error) {
    console.error('获取统计失败:', error)
    return NextResponse.json({ error: '获取统计失败' }, { status: 500 })
  }
}
