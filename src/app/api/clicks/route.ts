import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactId, platform, page } = body

    if (!contactId || !platform) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const data = await readData<{ clicks: Array<{ id: string; contactId: string; platform: string; page: string; timestamp: string; ip: string }> }>('clicks.json')
    
    const click = {
      id: Date.now().toString(),
      contactId,
      platform,
      page: page || '/',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    }

    data.clicks.push(click)
    await writeData('clicks.json', data)

    return NextResponse.json({ success: true, click })
  } catch (error) {
    console.error('记录点击失败:', error)
    return NextResponse.json({ error: '记录点击失败' }, { status: 500 })
  }
}
