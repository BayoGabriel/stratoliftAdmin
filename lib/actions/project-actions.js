"use server"

import dbConnect from "../mongodb"
import Project from "@/models/Project"
import { revalidatePath } from "next/cache"

export async function getProjects(status = null) {
  try {
    await dbConnect()

    const query = status ? { status } : {}

    const projects = await Project.find(query)
      .populate("assignedUsers", "firstName lastName email")
      .sort({ createdAt: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(projects)) }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function getProjectById(id) {
  try {
    await dbConnect()

    const project = await Project.findById(id).populate("assignedUsers", "firstName lastName email")

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(project)) }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error: "Failed to fetch project" }
  }
}

// Fix the createProject function to handle empty strings for ObjectId fields
export async function createProject(formData) {
  try {
    await dbConnect()

    const data = Object.fromEntries(formData)

    // Convert string values to appropriate types
    if (data.numberOfStops) data.numberOfStops = Number(data.numberOfStops)
    if (data.shaftWidth) data.shaftWidth = Number(data.shaftWidth)
    if (data.shaftDepth) data.shaftDepth = Number(data.shaftDepth)
    if (data.pitDepth) data.pitDepth = Number(data.pitDepth)
    if (data.costOfPurchase) data.costOfPurchase = Number(data.costOfPurchase)
    if (data.costOfInstallation) data.costOfInstallation = Number(data.costOfInstallation)
    if (data.customerCharge) data.customerCharge = Number(data.customerCharge)
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.completionDate) data.completionDate = new Date(data.completionDate)

    // Handle stops array
    if (data.numberOfStops && (!data.stops || data.stops.length === 0)) {
      data.stops = Array.from({ length: data.numberOfStops }, (_, i) => ({
        floorNumber: i,
        height: 0,
        description: `Floor ${i}`,
      }))
    }

    // Handle customer contact
    if (data["customerContact.name"]) {
      data.customerContact = {
        name: data["customerContact.name"],
        email: data["customerContact.email"],
        phone: data["customerContact.phone"],
        address: data["customerContact.address"],
      }

      // Remove individual fields
      delete data["customerContact.name"]
      delete data["customerContact.email"]
      delete data["customerContact.phone"]
      delete data["customerContact.address"]
    }

    // Handle assigned users
    if (data.assignedUsers && typeof data.assignedUsers === "string") {
      if (data.assignedUsers.trim() === "") {
        delete data.assignedUsers
      } else {
        data.assignedUsers = data.assignedUsers.split(",").map((id) => id.trim())
      }
    }

    const project = new Project(data)
    await project.save()

    revalidatePath("/projects")
    return { success: true, data: JSON.parse(JSON.stringify(project)) }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      error: "Failed to create project",
      details: error.message,
    }
  }
}

// Also fix the updateProject function
export async function updateProject(id, formData) {
  try {
    await dbConnect()

    const data = Object.fromEntries(formData)

    // Convert string values to appropriate types
    if (data.numberOfStops) data.numberOfStops = Number(data.numberOfStops)
    if (data.shaftWidth) data.shaftWidth = Number(data.shaftWidth)
    if (data.shaftDepth) data.shaftDepth = Number(data.shaftDepth)
    if (data.pitDepth) data.pitDepth = Number(data.pitDepth)
    if (data.costOfPurchase) data.costOfPurchase = Number(data.costOfPurchase)
    if (data.costOfInstallation) data.costOfInstallation = Number(data.costOfInstallation)
    if (data.customerCharge) data.customerCharge = Number(data.customerCharge)
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.completionDate) data.completionDate = new Date(data.completionDate)

    // Handle customer contact
    if (data["customerContact.name"]) {
      data.customerContact = {
        name: data["customerContact.name"],
        email: data["customerContact.email"],
        phone: data["customerContact.phone"],
        address: data["customerContact.address"],
      }

      // Remove individual fields
      delete data["customerContact.name"]
      delete data["customerContact.email"]
      delete data["customerContact.phone"]
      delete data["customerContact.address"]
    }

    // Handle assigned users
    if (data.assignedUsers && typeof data.assignedUsers === "string") {
      if (data.assignedUsers.trim() === "") {
        delete data.assignedUsers
      } else {
        data.assignedUsers = data.assignedUsers.split(",").map((id) => id.trim())
      }
    }

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
      return { success: false, error: "Project not found" }
    }

    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    return { success: true, data: JSON.parse(JSON.stringify(project)) }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id) {
  try {
    await dbConnect()

    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    revalidatePath("/projects")
    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function updateProjectStatus(id, status) {
  try {
    await dbConnect()

    const project = await Project.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    return { success: true, data: JSON.parse(JSON.stringify(project)) }
  } catch (error) {
    console.error("Error updating project status:", error)
    return { success: false, error: "Failed to update project status" }
  }
}
