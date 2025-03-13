import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  image: { 
    type: String 
  },
  emailVerified: { 
    type: Date 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  school: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  trackedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
  appliedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
