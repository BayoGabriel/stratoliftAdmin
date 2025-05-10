import types from "@eslint/eslintrc/lib/shared/types";
import mongoose from "mongoose"
import { customAlphabet } from 'nanoid';

// Generate 6-character ID with nanoid
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "admin", "technician"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
  elevator: {
    type: String,
    default: () => nanoid(),
    unique: true,
    index: true
  },
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User

