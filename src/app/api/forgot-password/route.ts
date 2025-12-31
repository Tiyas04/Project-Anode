import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Generate Random Password (8 characters)
        const newPassword = Math.random().toString(36).slice(-8);

        // Update User Password (hashing handled by pre-save hook)
        user.password = newPassword;
        await user.save();

        // Send Email
        await sendEmail({
            to: user.email,
            subject: "Password Reset - ChemStore",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset</h2>
                    <p>Hello ${user.name},</p>
                    <p>Your password has been reset successfully.</p>
                    <p>Your new temporary password is:</p>
                    <h3 style="color: #2563eb; background: #f0f9ff; padding: 10px; display: inline-block;">${newPassword}</h3>
                    <p>Please login and change your password immediately.</p>
                </div>
            `,
        });

        return NextResponse.json(
            {
                success: true,
                message: "New password sent to your email",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Forgot Password error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process request"
            },
            { status: 500 }
        );
    }
}
