//models/Location.js
import mongoose from "mongoose"

const LocationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  address: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  batteryLevel: {
    type: Number
  },
  accuracy: {
    type: Number
  }
})

// Create a geospatial index
LocationHistorySchema.index({ coordinates: "2dsphere" });
// Create a time-based index for efficient queries
LocationHistorySchema.index({ userId: 1, timestamp: -1 });

const LocationHistory = mongoose.models.LocationHistory || mongoose.model("LocationHistory", LocationHistorySchema)
export default LocationHistory