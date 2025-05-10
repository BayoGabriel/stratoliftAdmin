import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  submissionType: {
    type: String,
    enum: ["resuming", "closing"],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  elevatorId: {
    type: String,
    required: true,
  }
});

const Submission = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
export default Submission;
