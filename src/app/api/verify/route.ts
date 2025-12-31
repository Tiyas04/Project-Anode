import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user";
import GenerateAccessAndRefreshToken from "@/lib/generateaccessandrefreshtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { 
                    success: false, error: "Email and OTP are required"
                 },
                { 
                    status: 400
                 }
            );
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Verify OTP
        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                { success: false, error: "No OTP request found. Please login again." },
                { status: 400 }
            );
        }

        if (user.otp !== otp) {
            return NextResponse.json(
                { success: false, error: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json(
                { success: false, error: "OTP has expired. Please login again." },
                { status: 400 }
            );
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        // Generate Tokens
        const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(user._id);
        const loggedInUser = await UserModel.findById(user._id).select("-password -__v -otp -otpExpiry");

        // Set Cookies & Response
        const res = NextResponse.json(
            {
                success: true,
                message: "Verification successful",
                data: loggedInUser
            },
            { status: 200 }
        );

        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax" as const,
            path: "/",
            maxAge: 24 * 60 * 60 // 1 day
        };

        res.cookies.set("accessToken", accessToken, cookieOptions);
        res.cookies.set("refreshToken", refreshToken, cookieOptions);

        return res;

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Verification failed"
            },
            { status: 500 }
        );
    }
}
