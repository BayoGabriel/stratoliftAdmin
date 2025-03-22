import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

// Generate 6-character ID with nanoid
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    default: () => nanoid(),
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['service', 'sos', 'maintenance'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'resolved', 'unresolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  updates: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  attachments: [{
    url: String,
    name: String,
    type: String
  }]
});

// Update the updatedAt field before saving
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;