import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user";
import { NextRequest,NextResponse } from "next/server";

export async function PATCH(request:NextRequest){
    try {
        await dbConnect()

        const userId = request.headers.get("userId")

        if(!userId){
            return NextResponse.json(
                {
                    success:false,
                    message:"Unauthorized access"
                },
                {
                    status:401
                }
            )
        }

        const user = await UserModel.findById(userId)

        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:404
                }
            )
        }

        const body = await request.json()

        const {oldpassword, newpassword} = body

        if(!oldpassword || !newpassword){
            return NextResponse.json(
                {
                    success:false,
                    message:"Missing required fields"
                },
                {
                    status:400
                }
            )
        }

        const isPasswordValid = await user.comparePassword(oldpassword)

        if(!isPasswordValid){
            return NextResponse.json(
                {
                    success:false,
                    message:"Invalid password"
                },
                {
                    status:400
                }
            )
        }

        user.password = newpassword

        await user.save({validateBeforeSave:false})

        return NextResponse.json(
            {
                success:true,
                message:"Password changed successfully"
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success:false,
                message:"Internal server error"
            },
            {
                status:500
            }
        )
    }
}