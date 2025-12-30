export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import dbConnect from "./lib/dbconnect"
import UserModel from "./models/user"

export async function middleware(request: NextRequest) {
  try {
    await dbConnect()

    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: "No active sessions found"
        },
        {
          status: 403
        }
      )
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload

    const user = await UserModel.findById(decoded.id)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access"
        },
        {
          status: 403
        }
      )
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("userid", user._id.toString())
    requestHeaders.set("role", user.role)

    // Admin Access Control
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (user.role !== "admin") {
        // Rewrite to show 404 page while keeping URL same
        return NextResponse.rewrite(new URL("/404", request.url))
      }

      // If admin visits /admin directly, redirect to dashboard
      if (request.nextUrl.pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error: any) {
    // If accessing admin pages with invalid token, rewrite to 404
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL("/404", request.url))
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Invalid or expired token",
      },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: ["/api/auth/:path*", "/admin/:path*"]
}
