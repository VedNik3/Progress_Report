import express from "express"
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import projectRoute from './routes/projectRoute.js'
import userRoute from './routes/userRoute.js'


dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    'https://progress-report-chi.vercel.app', 
    'http://localhost:5173'  // Keep local development URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

  app.use(cors(corsOptions));       
                               
const connectToDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      process.exit(1); 
    }   
  };

app.use("/api/project", projectRoute);
app.use("/api/user", userRoute);


connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })