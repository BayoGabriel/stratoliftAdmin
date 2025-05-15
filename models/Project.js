import mongoose from "mongoose";
import { customAlphabet } from 'nanoid';

// Generate 8-character ID with nanoid
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const StopSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true
  },
  height: {
    type: Number, // in mm
    required: true
  },
  description: {
    type: String,
    trim: true
  }
});

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    default: () => `PRJ-${nanoid()}`,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  numberOfStops: {
    type: Number,
    required: [true, "Number of stops is required"],
    min: [1, "At least one stop is required"]
  },
  stops: [StopSchema],
  shaftWidth: {
    type: Number, // in mm
    required: [true, "Shaft width is required"]
  },
  shaftDepth: {
    type: Number, // in mm
    required: [true, "Shaft depth is required"]
  },
  pitDepth: {
    type: Number, // in mm
    required: [true, "Pit depth is required"]
  },
  supplier: {
    type: String,
    enum: ["Pumalift", "MP", "Canny", "Other"],
    required: [true, "Supplier is required"]
  },
  otherSupplier: {
    type: String,
    trim: true
  },
  costOfPurchase: {
    type: Number,
    required: [true, "Cost of purchase is required"]
  },
  costOfInstallation: {
    type: Number,
    required: [true, "Cost of installation is required"]
  },
  customerCharge: {
    type: Number,
    required: [true, "Customer charge is required"]
  },
  customerContact: {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ["Planning", "In Progress", "Completed", "On Hold", "Cancelled"],
    default: "Planning"
  },
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
