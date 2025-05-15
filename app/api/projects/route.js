import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const query = status ? { status } : {}

    const projects = await Project.find(query)
      .populate("assignedUsers", "firstName lastName email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const data = await request.json()

    // Ensure stops array is properly formatted
    if (data.numberOfStops && (!data.stops || data.stops.length === 0)) {
      data.stops = Array.from({ length: data.numberOfStops }, (_, i) => ({
        floorNumber: i,
        height: 0,
        description: `Floor ${i}`,
      }))
    }

    const project = new Project(data)
    await project.save()

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
        details: error.message,
      },
      { status: 400 },
    )
  }
}
