import { NextResponse } from 'next/server'
import { verifyToken } from '@clerk/backend'

export async function middleware(req) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = authHeader.split(' ')[1]
    const { userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// Only match protected API routes:
export const config = {
  matcher: ['/api/protected-route'], // Adjust this as needed
}
