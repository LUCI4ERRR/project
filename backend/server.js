// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// API routes
import authRoutes from '../routes/auth.js';
app.use('/api/auth', authRoutes);

// simple test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// connect to DB + start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
