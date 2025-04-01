import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Task from "@/models/Task"

export async function GET() {
  try {
    await dbConnect()

    // Get all technicians
    const technicians = await User.find({ role: "technician" })

    // Get all tasks to check assignments
    const tasks = await Task.find({})

    // Enhance technician data with task information
    const enhancedTechnicians = await Promise.all(
      technicians.map(async (tech) => {
        const techObj = tech.toObject()

        // Find tasks assigned to this technician
        const assignedTasks = tasks.filter(
          (task) => task.assignedTo && task.assignedTo.toString() === tech._id.toString(),
        )

        // Check if technician is on duty (has at least one assigned task)
        const isOnDuty = assignedTasks.length > 0

        return {
          ...techObj,
          isOnDuty,
          assignedTasksCount: assignedTasks.length,
          status: isOnDuty ? "Active" : "Inactive",
        }
      }),
    )

    return NextResponse.json(enhancedTechnicians, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error }, { status: 500 })
  }
}

