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

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        existingUser.lastLogin = new Date();
        await existingUser.save({ validateBeforeSave: false });

        // Send OTP via Email
        try {
            const { sendEmail } = await import("@/lib/sendEmail");
            await sendEmail({
                to: existingUser.email,
                subject: "Your Login Verification Code",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Login Verification</h2>
                        <p>Hello ${existingUser.name},</p>
                        <p>Your verification code is:</p>
                        <h1 style="color: #2563eb; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to send verification email"
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "OTP sent to your email",
                requireOtp: true,
                email: existingUser.email // pass back to frontend to confirm which email was used
            },
            {
                status: 200
            }
        );
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