import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // DO NOT remove this: Required for Supabase session refresh
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only protect certain routes. Allow /, /login, /signup, and /auth/*
  const publicRoutes = ['/', '/login', '/signup']
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isPublic = publicRoutes.includes(request.nextUrl.pathname) || isAuthRoute

  if (!user && !isPublic) {
    // Not authenticated and not visiting a public page, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
