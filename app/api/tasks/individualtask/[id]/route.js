import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Task from "@/models/Task"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request, { params }) {
  const taskId = params.id

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  // Get the user from the database
  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  try {
    // First try to find by taskId (the nanoid)
    let task = await Task.findOne({ taskId: taskId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    // If not found, try to find by MongoDB _id
    if (!task) {
      task = await Task.findOne({ _id: taskId })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("updates.updatedBy", "name email role")
    }

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 },
      )
    }

    // Apply role-based access control
    if (user.role === "user" && !task.createdBy._id.equals(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to view this task",
        },
        { status: 403 },
      )
    } else if (user.role === "technician" && (!task.assignedTo || !task.assignedTo._id.equals(user._id))) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to view this task",
        },
        { status: 403 },
      )
    } else if (user.role === "admin" && task.school !== user.school) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to view this task",
        },
        { status: 403 },
      )
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

