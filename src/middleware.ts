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

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error: any) {
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
  matcher: ["/api/auth/:path*"]
}
