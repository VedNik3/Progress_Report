import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String, // Candidate ID
    required: true,
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed', 'Incomplete'],
    default: 'Assigned',
  },
  progress: {
    type: Number, // A percentage (0-100)
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  tasks: [
    {
      title: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false, // Track whether the task is completed
      },
    },
  ],
  score: {
    type: Number, // Score for the project (calculated based on completed tasks)
    default: 0, 
  },
}, { timestamps: true });



export const Project = mongoose.model('Project', ProjectSchema);
