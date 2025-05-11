import mongoose from "mongoose"

const ClockInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clockInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  clockOutTime: {
    type: Date,
    default: null,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Add virtual field for duration
ClockInSchema.virtual("duration").get(function () {
  if (!this.clockOutTime) return null
  return (this.clockOutTime - this.clockInTime) / (1000 * 60 * 60) // Duration in hours
})

// Ensure virtuals are included when converting to JSON
ClockInSchema.set("toJSON", { virtuals: true })
ClockInSchema.set("toObject", { virtuals: true })

const ClockIn = mongoose.models.ClockIn || mongoose.model("ClockIn", ClockInSchema)
export default ClockIn
