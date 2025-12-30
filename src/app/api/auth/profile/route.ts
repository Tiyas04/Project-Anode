import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userid = request.headers.get("userid")

        const user = await UserModel.findById(userid).select("-password -__v -refreshToken -_id")

        return NextResponse.json(
            {
                success: true,
                message: "User found",
                data: user
            },
            {
                status: 200
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