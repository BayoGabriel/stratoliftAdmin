import connectMongo from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"
import { NextResponse } from "next/server"

// In a real application, you would send an email with a reset link
// For this example, we'll just generate a token and return it
export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Please provide an email address" }, { status: 400 })
    }

    await connectMongo()

    const user = await User.findOne({ email })
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link" },
        { status: 200 },
      )
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now

    // In a real application, you would store this token in the database
    // and send an email with a link containing the token
    // For this example, we'll just return the token

    // In a real application:
    // user.resetToken = resetToken;
    // user.resetTokenExpiry = resetTokenExpiry;
    // await user.save();

    // Send email with reset link (not implemented in this example)
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    // await sendEmail({ to: email, subject: 'Password Reset', text: `Click here to reset your password: ${resetUrl}` });

    return NextResponse.json(
      {
        message: "If your email is registered, you will receive a password reset link",
        // Only for demonstration, in a real app you wouldn't return the token
        token: resetToken,
        expires: resetTokenExpiry,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 })
  }
}
