import mongoose from "mongoose"
import { customAlphabet } from "nanoid"

// Generate 8-character ID with nanoid
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8)

const InventorySchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      default: () => `INV-${nanoid()}`,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    dateSupplied: {
      type: Date,
      default: Date.now,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Low Stock", "Out of Stock"],
      default: "Available",
    },
    location: {
      type: String,
      trim: true,
    },
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

// Update status based on quantity
InventorySchema.pre("save", function (next) {
  if (this.quantity <= 0) {
    this.status = "Out of Stock"
  } else if (this.quantity <= 5) {
    this.status = "Low Stock"
  } else {
    this.status = "Available"
  }
  next()
})

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema)
export default Inventory
