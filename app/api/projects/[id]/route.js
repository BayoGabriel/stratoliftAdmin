import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const project = await Project.findById(id).populate("assignedUsers", "firstName lastName email")

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const data = await request.json()

    // Update stops array if numberOfStops changed
    if (data.numberOfStops) {
      const currentProject = await Project.findById(id)
      if (currentProject && data.numberOfStops > currentProject.stops.length) {
        const newStops = Array.from({ length: data.numberOfStops - currentProject.stops.length }, (_, i) => ({
          floorNumber: currentProject.stops.length + i,
          height: 0,
          description: `Floor ${currentProject.stops.length + i}`,
        }))
        data.stops = [...currentProject.stops, ...newStops]
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}
