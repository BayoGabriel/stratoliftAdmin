import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/models/User"

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return

  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// GET handler to fetch user profile
export async function GET(req) {
  try {
    await connectDB()

    // In a real app, you would get the user ID from the session
    // For this example, we'll just get the first user
    const user = await User.findOne({}).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

// PUT handler to update user profile
export async function PUT(req) {
  try {
    await connectDB()

    const data = await req.json()

    // In a real app, you would get the user ID from the session
    // For this example, we'll just update the first user
    const user = await User.findOne({})

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update only the fields that were sent in the request
    Object.keys(data).forEach((field) => {
      // Only update allowed fields
      if (["name", "email", "image", "school", "role", "status"].includes(field)) {
        user[field] = data[field]
      }
    })

    // Update the updatedAt field
    user.updatedAt = new Date()

    await user.save()

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        school: user.school,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}

