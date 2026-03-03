import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/protected'

    if (code) {
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Forward the user to the update-password page if that was their intent
            // Or let them pass to wherever `next` was going.
            if (next.includes('update-password')) {
                return NextResponse.redirect(new URL(next, request.url))
            }
            return NextResponse.redirect(new URL(next, request.url))
        }

        console.error("Auth Callback Error:", error)
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/auth/error?message=Token de recuperacao invalido ou expirado', request.url))
}
