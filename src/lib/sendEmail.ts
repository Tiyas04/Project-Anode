import { Resend } from "resend";

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

export const sendEmail = async (options: EmailOptions) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY is not defined in environment variables.");
    }

    const resend = new Resend(apiKey);
    const from = options.from || process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || "Sai PSB Laboratory <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });

    if (error) {
        console.error("[RESEND EMAIL ERROR]", error);
        throw new Error(error.message || "Failed to send email via Resend");
    }

    return data;
};
