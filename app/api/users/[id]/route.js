import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { apiAuth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request, { params }) {
  try {
    // Verify authentication
    const payload = await apiAuth(request)
    if (!payload) {
      return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    const { id } = params

    // Users can view their own profile, admins can view any profile
    if (payload.id !== id && payload.role !== "admin" && payload.role !== "manager") {
      return new NextResponse(JSON.stringify({ success: false, message: "Insufficient permissions" }), { status: 403 })
    }

    await dbConnect()
    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const payload = await apiAuth(request)
    if (!payload) {
      return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    const { id } = params

    // Users can update their own profile, admins can update any profile
    if (payload.id !== id && payload.role !== "admin") {
      return new NextResponse(JSON.stringify({ success: false, message: "Insufficient permissions" }), { status: 403 })
    }

    const data = await request.json()

    // Remove sensitive fields if not admin
    if (payload.role !== "admin") {
      delete data.role
      delete data.status
    }

    await dbConnect()

    // Handle password update
    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }

    const user = await User.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const payload = await apiAuth(request)
    if (!payload) {
      return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    // Only admins can delete users
    if (payload.role !== "admin") {
      return new NextResponse(JSON.stringify({ success: false, message: "Insufficient permissions" }), { status: 403 })
    }

    const { id } = params

    await dbConnect()
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
