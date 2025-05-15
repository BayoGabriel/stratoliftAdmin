"use server"
import dbConnect from "../mongodb"
import Inventory from "@/models/Inventory"
import { revalidatePath } from "next/cache"

export async function getInventories(projectId = null) {
  try {
    await dbConnect()

    const query = projectId ? { project: projectId } : {}

    const inventories = await Inventory.find(query)
      .populate("project", "name projectId")
      .populate("assignedTo", "firstName lastName email")
      .populate("usedBy.user", "firstName lastName email")
      .sort({ createdAt: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(inventories)) }
  } catch (error) {
    console.error("Error fetching inventories:", error)
    return { success: false, error: "Failed to fetch inventories" }
  }
}

export async function getInventoryById(id) {
  try {
    await dbConnect()

    const inventory = await Inventory.findById(id)
      .populate("project", "name projectId")
      .populate("assignedTo", "firstName lastName email")
      .populate("usedBy.user", "firstName lastName email")

    if (!inventory) {
      return { success: false, error: "Inventory not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(inventory)) }
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return { success: false, error: "Failed to fetch inventory" }
  }
}

// Fix the createInventory function to handle empty strings for ObjectId fields
export async function createInventory(formData) {
  try {
    await dbConnect()

    const data = Object.fromEntries(formData)

    // Convert string values to appropriate types
    if (data.quantity) data.quantity = Number(data.quantity)
    if (data.dateSupplied) data.dateSupplied = new Date(data.dateSupplied)

    // Handle empty strings for ObjectId fields
    if (data.project === "") delete data.project
    if (data.assignedTo === "") delete data.assignedTo

    const inventory = new Inventory(data)
    await inventory.save()

    revalidatePath("/inventory")
    return { success: true, data: JSON.parse(JSON.stringify(inventory)) }
  } catch (error) {
    console.error("Error creating inventory:", error)
    return {
      success: false,
      error: "Failed to create inventory",
      details: error.message,
    }
  }
}

// Also fix the updateInventory function
export async function updateInventory(id, formData) {
  try {
    await dbConnect()

    const data = Object.fromEntries(formData)

    // Convert string values to appropriate types
    if (data.quantity) data.quantity = Number(data.quantity)
    if (data.dateSupplied) data.dateSupplied = new Date(data.dateSupplied)

    // Handle empty strings for ObjectId fields
    if (data.project === "") delete data.project
    if (data.assignedTo === "") delete data.assignedTo

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!inventory) {
      return { success: false, error: "Inventory not found" }
    }

    revalidatePath("/inventory")
    revalidatePath(`/inventory/${id}`)
    return { success: true, data: JSON.parse(JSON.stringify(inventory)) }
  } catch (error) {
    console.error("Error updating inventory:", error)
    return { success: false, error: "Failed to update inventory" }
  }
}

export async function deleteInventory(id) {
  try {
    await dbConnect()

    const inventory = await Inventory.findByIdAndDelete(id)

    if (!inventory) {
      return { success: false, error: "Inventory not found" }
    }

    revalidatePath("/inventory")
    return { success: true, message: "Inventory deleted successfully" }
  } catch (error) {
    console.error("Error deleting inventory:", error)
    return { success: false, error: "Failed to delete inventory" }
  }
}

export async function useInventory(id, userId, quantity) {
  try {
    await dbConnect()

    const inventory = await Inventory.findById(id)

    if (!inventory) {
      return { success: false, error: "Inventory not found" }
    }

    if (inventory.quantity < quantity) {
      return { success: false, error: "Not enough inventory available" }
    }

    // Add to usedBy array
    inventory.usedBy.push({
      user: userId,
      date: new Date(),
      quantity: quantity,
    })

    // Update quantity
    inventory.quantity -= quantity

    await inventory.save()

    revalidatePath("/inventory")
    revalidatePath(`/inventory/${id}`)
    return { success: true, data: JSON.parse(JSON.stringify(inventory)) }
  } catch (error) {
    console.error("Error using inventory:", error)
    return { success: false, error: "Failed to use inventory" }
  }
}
