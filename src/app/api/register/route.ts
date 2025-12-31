import UserModel from "@/models/user";
import dbConnect from "@/lib/dbconnect";
import generateAccessAndRefreshToken from "@/lib/generateaccessandrefreshtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect()

        const body = await request.json()
        const { name, email, phoneno, password, institution } = body

        if ([name, email, phoneno, password, institution].some(field => !field || String(field).trim() === "")) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Missing required fields: ${[
                        !name && "name",
                        !email && "email",
                        !institution && "institution",
                        !phoneno && "phoneno",
                        !password && "password"
                    ].filter(Boolean).join(", ")}`
                },
                {
                    status: 400
                }
            )
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { phoneno }]
        })

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User already exists"
                },
                {
                    status: 400
                }
            )
        }

        const user = await UserModel.create({
            name,
            email,
            institution,
            phoneno,
            password
        })

        const createdUser = await UserModel.findById(user._id).select("-_id -password -__v")

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully. Please login to verify.",
                data: createdUser
            },
            {
                status: 201
            }
        )
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