import dbConnect from "@/lib/dbconnect";
import GenerateAccessAndRefreshToken from "@/lib/generateaccessandrefreshtoken";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { email, phoneno, password } = await request.json()

        if ((!email || !phoneno) && !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: "All fields are required"
                },
                {
                    status: 400
                }
            )
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { phoneno }]
        })

        if (!existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const isPasswordMatched = await existingUser.comparePassword(password)

        if (!isPasswordMatched) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid credentials"
                },
                {
                    status: 401
                }
            )
        }

        // Update last login
        existingUser.lastLogin = new Date()
        await existingUser.save({ validateBeforeSave: false })

        const user = await UserModel.findById(existingUser._id).select("-__id -password -__v")

        const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(existingUser._id)

        const res = NextResponse.json(
            {
                success: true,
                message: "User logged in successfully",
                data: user
            },
            {
                status: 200
            }
        )


        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax" as const,
            path: "/",
            maxAge: 24 * 60 * 60 // 1 day
        };

        res.cookies.set("accessToken", accessToken, cookieOptions)
        res.cookies.set("refreshToken", refreshToken, cookieOptions)

        return res
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