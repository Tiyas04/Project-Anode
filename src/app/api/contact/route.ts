import ResponseModel from "@/models/response";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const { name, email, phone, message } = await request.json()

        if ([name, email, phone, message].some((field) => field?.trim() === "")) {
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

        const response = await ResponseModel.create({
            name,
            email,
            phone,
            message
        })

        // Fetch all admins
        const { default: UserModel } = await import("@/models/user");
        const admins = await UserModel.find({ role: 'admin' }).select('email');
        const adminEmails = admins.map(admin => admin.email);

        if (adminEmails.length > 0) {
            const { sendEmail } = await import("@/lib/sendEmail");

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
                    <h2 style="color: #0bd1d1;">New Contact Form Submission</h2>
                    <p>A new message has been received.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0bd1d1; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <strong>Message:</strong>
                        <p style="white-space: pre-wrap; background-color: #f1f5f9; padding: 15px; border-radius: 5px;">${message}</p>
                    </div>
                </div>
            `;

            await sendEmail({
                to: adminEmails,
                subject: "New Contact Form Submission - Sai PSB Laboratory",
                html: emailHtml
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                data: message
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
                error: "Something went wrong"
            },
            {
                status: 500
            }
        )
    }
}
