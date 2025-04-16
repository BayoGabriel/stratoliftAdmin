import connectMongo from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { token, password, confirmPassword } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 })
    }

    await connectMongo()

    // In a real application, you would find the user by the reset token
    // and check if the token is still valid
    // For this example, we'll just pretend it works

    // In a real application:
    // const user = await User.findOne({
    //   resetToken: token,
    //   resetTokenExpiry: { $gt: Date.now() }
    // });

    // if (!user) {
    //   return NextResponse.json(
    //     { message: 'Invalid or expired token' },
    //     { status: 400 }
    //   );
    // }

    // For demonstration purposes only:
    // In a real app, you would use the token to find the user
    const user = { email: "demo@example.com" }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // In a real application:
    // user.password = hashedPassword;
    // user.resetToken = undefined;
    // user.resetTokenExpiry = undefined;
    // await user.save();

    return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 })
  }
}
