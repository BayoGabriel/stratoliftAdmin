import mongoose from "mongoose"
import { customAlphabet } from "nanoid"

// Generate 8-character ID with nanoid
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8)

const StopSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number, // in mm
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
})

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      default: () => `PRJ-${nanoid()}`,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    numberOfStops: {
      type: Number,
      default: 1,
    },
    stops: [StopSchema],
    shaftWidth: {
      type: Number, // in mm
      default: 0,
    },
    shaftDepth: {
      type: Number, // in mm
      default: 0,
    },
    pitDepth: {
      type: Number, // in mm
      default: 0,
    },
    supplier: {
      type: String,
      enum: ["Pumalift", "MP", "Canny", "Other"],
      default: "Pumalift",
    },
    otherSupplier: {
      type: String,
      trim: true,
    },
    costOfPurchase: {
      type: Number,
      default: 0,
    },
    costOfInstallation: {
      type: Number,
      default: 0,
    },
    customerCharge: {
      type: Number,
      default: 0,
    },
    customerContact: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold", "Cancelled"],
      default: "Planning",
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema)
export default Project
