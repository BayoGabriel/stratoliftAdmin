import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Task from "@/models/Task"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request) {
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

  // Only admins can assign tasks
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Only administrators can assign tasks",
      },
      { status: 403 },
    )
  }

  try {
    const { taskId, technicianId, message } = await request.json()

    if (!taskId || !technicianId) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID and technician ID are required",
        },
        { status: 400 },
      )
    }

    // Find the technician
    const technician = await User.findById(technicianId)

    if (!technician || technician.role !== "technician") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid technician ID",
        },
        { status: 400 },
      )
    }

    // Find the task by taskId or _id
    let task = await Task.findOne({ taskId: taskId })

    if (!task) {
      task = await Task.findById(taskId)
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

    // Check if user has permission 
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to assign this task",
        },
        { status: 403 },
      )
    }

    // Update the task
    task.assignedTo = technicianId
    task.status = "assigned"

    // Add update message
    task.updates.push({
      message: message || `Task assigned to ${technician.name}`,
      updatedBy: user._id,
    })

    await task.save()

    // Return the updated task with populated fields
    const updatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    return NextResponse.json(
      {
        success: true,
        message: "Task assigned successfully",
        data: updatedTask,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

