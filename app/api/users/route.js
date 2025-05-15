import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { apiAuth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request) {
  try {
    // Verify authentication
    const payload = await apiAuth(request)
    if (!payload) {
      return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    // Check if user has admin role
    if (payload.role !== "admin" && payload.role !== "manager") {
      return new NextResponse(JSON.stringify({ success: false, message: "Insufficient permissions" }), { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    const query = {}
    if (role) query.role = role
    if (status) query.status = status

    await dbConnect()
    const users = await User.find(query).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const payload = await apiAuth(request)
    if (!payload) {
      return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    // Check if user has admin role
    if (payload.role !== "admin") {
      return new NextResponse(JSON.stringify({ success: false, message: "Insufficient permissions" }), { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    // Create new user
    const newUser = new User({
      ...data,
      password: hashedPassword,
    })

    await newUser.save()

    // Return user without password
    const user = newUser.toObject()
    delete user.password

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create user", details: error.message },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
