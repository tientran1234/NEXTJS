import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'

const managePaths = ['/manage']
const unAuthPaths = ['/login']
const guestPaths = ['/guest']
const onlyOwnerPath = ["/manage/accounts"]
const privatePaths = [...managePaths, ...guestPaths]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value


    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('clearTokens', 'true')
        return NextResponse.redirect(url)
    }
    if (refreshToken) {
        if (unAuthPaths.some(path => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL('/', request.url))


        }
        if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {

            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        const role = decodeToken(refreshToken).role

        const isGuestGoToManagePaths = (role === Role.Guest && managePaths.some((path) => pathname.startsWith(path)))
        const isNotGuestGoToManagePaths = (role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path)))
        const isNotOwnerGoToOwnerPath = (role !== Role.Owner && onlyOwnerPath.some((path) => pathname.startsWith(path)))


        if (isGuestGoToManagePaths || isNotGuestGoToManagePaths || isNotOwnerGoToOwnerPath) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/guest/:path*', '/login'],
}