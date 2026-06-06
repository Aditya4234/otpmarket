import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/', '')
  const searchParams = req.nextUrl.searchParams.toString()
  const url = `${API_URL}/${path}${searchParams ? `?${searchParams}` : ''}`

  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'API request failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/', '')
  const url = `${API_URL}/${path}`
  const body = await req.json()
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'API request failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/', '')
  const url = `${API_URL}/${path}`
  const body = await req.json()
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'API request failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/', '')
  const url = `${API_URL}/${path}`
  const body = await req.json()
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'API request failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/', '')
  const url = `${API_URL}/${path}`
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'API request failed' }, { status: 500 })
  }
}
