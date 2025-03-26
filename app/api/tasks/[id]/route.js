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
    // Build query to fetch the task
    const query = { _id: taskId }

    // Apply role-based access control
    if (user.role === "user") {
      // Users can only see their own tasks
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians can only see tasks assigned to them
      query.assignedTo = user._id
    } else if (user.role === "admin") {
      // Admins can see all tasks from their school
      query.school = user.school
    }

    // Get the task with populated user info
    const task = await Task.findOne(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found or you do not have permission to view it",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

// Add ability to update a specific task
export async function PATCH(request, { params }) {
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
    const body = await request.json()

    // Build query to find the task
    const query = { _id: taskId }

    // Apply role-based access control for finding the task
    if (user.role === "user") {
      // Users can only update their own tasks
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians can only update tasks assigned to them
      query.assignedTo = user._id
    } else if (user.role === "admin") {
      // Admins can update all tasks from their school
      query.school = user.school
    }

    // Find the task first to check permissions
    const existingTask = await Task.findOne(query)

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found or you do not have permission to update it",
        },
        { status: 404 },
      )
    }

    // If there's an update message, add it to the updates array
    if (body.updateMessage) {
      if (!body.updates) {
        body.updates = []
      }

      body.updates.push({
        message: body.updateMessage,
        updatedBy: user._id,
        updatedAt: new Date(),
      })

      // Remove the updateMessage from the body as it's now in the updates array
      delete body.updateMessage
    }

    // Update the task
    const updatedTask = await Task.findOneAndUpdate(query, { $set: body }, { new: true, runValidators: true })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

// Add ability to delete a specific task
export async function DELETE(request, { params }) {
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
    // Build query to find the task
    const query = { _id: taskId }

    // Apply role-based access control
    // Only admins and the original creator can delete tasks
    if (user.role === "user") {
      // Users can only delete their own tasks
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians cannot delete tasks
      return NextResponse.json(
        {
          success: false,
          message: "Technicians are not authorized to delete tasks",
        },
        { status: 403 },
      )
    } else if (user.role === "admin") {
      // Admins can delete all tasks from their school
      query.school = user.school
    }

    // Delete the task
    const deletedTask = await Task.findOneAndDelete(query)

    if (!deletedTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found or you do not have permission to delete it",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

