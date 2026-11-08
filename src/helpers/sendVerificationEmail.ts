import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Mystery message | verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: "Verification email sent succssfully"
        }

    } catch (emailError) {
        console.error("Error sending verification email", emailError);

        return {
            success: false,
            message: "Failed to send Verification Email."
        }
    }
}
