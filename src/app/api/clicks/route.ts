import { NextRequest, NextResponse } from 'next/server'
import { recordClick } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactId, platform, page } = body

    if (!contactId || !platform) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const click = await recordClick(
      contactId,
      platform,
      page || '/',
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    )

    return NextResponse.json({ success: true, click })
  } catch (error) {
    console.error('记录点击失败:', error)
    return NextResponse.json({ error: '记录点击失败' }, { status: 500 })
  }
}
