import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const inventory = await Inventory.findById(id)
      .populate("project", "name projectId")
      .populate("assignedTo", "firstName lastName email")
      .populate("usedBy.user", "firstName lastName email")

    if (!inventory) {
      return NextResponse.json({ success: false, error: "Inventory not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const data = await request.json()

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!inventory) {
      return NextResponse.json({ success: false, error: "Inventory not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: inventory })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ success: false, error: "Failed to update inventory" }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const { id } = params
    const inventory = await Inventory.findByIdAndDelete(id)

    if (!inventory) {
      return NextResponse.json({ success: false, error: "Inventory not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Inventory deleted successfully" })
  } catch (error) {
    console.error("Error deleting inventory:", error)
    return NextResponse.json({ success: false, error: "Failed to delete inventory" }, { status: 500 })
  }
}
