import { NextResponse } from 'next/server'
import { getClickStats } from '@/lib/db'

export async function GET() {
  try {
    const result = await getClickStats()

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('获取统计失败:', error)
    return NextResponse.json({ error: '获取统计失败' }, { status: 500 })
  }
}
