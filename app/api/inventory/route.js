import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const query = projectId ? { project: projectId } : {}

    const inventories = await Inventory.find(query)
      .populate("project", "name projectId")
      .populate("assignedTo", "firstName lastName email")
      .populate("usedBy.user", "firstName lastName email")
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: inventories })
  } catch (error) {
    console.error("Error fetching inventories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch inventories" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const data = await request.json()
    const inventory = new Inventory(data)
    await inventory.save()

    return NextResponse.json({ success: true, data: inventory }, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create inventory",
        details: error.message,
      },
      { status: 400 },
    )
  }
}
