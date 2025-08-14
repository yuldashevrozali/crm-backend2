// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import studentsRouter from "./routes/students.js";
import coursesRouter from "./routes/courses.js";
import teachersRouter from "./routes/teachers.js";
import attendancesRouter from "./routes/attendances.js"; // nomini to'g'ri qo'ying
import paymentsRouter from './routes/payments.js';
import testsRouter from './routes/tests.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/attendances", attendancesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/tests', testsRouter);

// Test route
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Backend ishlayapti!</h1>
    <p><strong>Attendances:</strong> <a href="/api/attendances">/api/attendances</a></p>
  `);
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route topilmadi" });
});

// MongoDB ulanish
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB ulandi"))
.catch(err => console.error("❌ MongoDB ulanmadi:", err));

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});