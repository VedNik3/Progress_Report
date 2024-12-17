import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  candidateId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['candidate','admin'],
    default: 'candidate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

export const User = mongoose.model("User", UserSchema);
