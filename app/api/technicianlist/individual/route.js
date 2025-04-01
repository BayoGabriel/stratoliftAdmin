import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Task from "@/models/Task"
import { isValidObjectId } from "mongoose"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid technician ID" }, { status: 400 })
    }

    // Get technician details
    const technician = await User.findById(id)

    if (!technician || technician.role !== "technician") {
      return NextResponse.json({ message: "Technician not found" }, { status: 404 })
    }

    // Get tasks assigned to this technician
    const assignedTasks = await Task.find({ assignedTo: id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    // Convert to plain object and add tasks
    const technicianData = technician.toObject()
    technicianData.assignedTasks = assignedTasks

    return NextResponse.json(technicianData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error fetching technician details", error }, { status: 500 })
  }
}

