// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { resetMonthlyPaymentStatus } from "./utils/scheduler.js";

// Routes
import studentsRouter from "./routes/students.js";
import coursesRouter from "./routes/courses.js";
import teachersRouter from "./routes/teachers.js";
import attendancesRouter from "./routes/attendances.js"; // nomini to'g'ri qo'ying
import paymentsRouter from './routes/payments.js';
import testsRouter from './routes/tests.js';
import leadsRouter from './routes/leads.js';
import schedulerRouter from './routes/scheduler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://crm-new-gamma-one.vercel.app",
    "http://localhost:3001",
    "http://localhost:8082",
    "http://localhost:8081"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/attendances", attendancesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/scheduler', schedulerRouter);

// Test route
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Backend ishlayapti!</h1>
    <p><strong>Attendances:</strong> <a href="/api/attendances">/api/attendances</a></p>
    <p><strong>Leads:</strong> <a href="/api/leads">/api/leads</a></p>
    <p><strong>Leads Stats:</strong> <a href="/api/leads/stats/overview">/api/leads/stats/overview</a></p>
    <p><strong>Scheduler Info:</strong> <a href="/api/scheduler/info">/api/scheduler/info</a></p>
    <p><strong>Unpaid Students:</strong> <a href="/api/scheduler/unpaid-students">/api/scheduler/unpaid-students</a></p>
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
.then(() => {
  console.log("✅ MongoDB ulandi");
  // Scheduler ni ishga tushirish
  resetMonthlyPaymentStatus();
})
.catch(err => console.error("❌ MongoDB ulanmadi:", err));

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});