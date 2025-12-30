import dbConnect from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const userid = request.headers.get("userid")

        if (!userid) {
            return NextResponse.json(
                {
                    success: true,
                    message: "User already logged out or session not found"
                },
                {
                    status: 200
                }
            )
        }

        await UserModel.findByIdAndUpdate(userid, {
            $unset: {
                refreshToken: 1
            }
        })

        const response = NextResponse.json(
            {
                success: true,
                message: "User logged out successfully"
            },
            {
                status: 200
            }
        )

        response.cookies.set("accessToken", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/"
        })

        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/"
        })

        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                error: (error as Error).message || "Something went wrong"
            },
            {
                status: 500
            }
        )
    }
}