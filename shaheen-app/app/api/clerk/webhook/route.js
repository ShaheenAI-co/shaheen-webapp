import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Webhook } from 'svix'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req) {
  const payload = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    const evt = wh.verify(payload, headers)

    const { type, data } = evt

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data
      const email = email_addresses?.[0]?.email_address || ''

      await supabase.from('users').upsert({
        clerk_id: id,
        email,
        first_name,
        last_name,
      }, {
        onConflict: 'clerk_id',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}
