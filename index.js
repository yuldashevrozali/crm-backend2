import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studentsRouter from "./routes/students.js";
import coursesRouter from "./routes/courses.js";
import teachersRouter from "./routes/teachers.js";
import attendancesRouter from "./routes/attendances.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/attendances", attendancesRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch(err => console.error("❌ MongoDB xato:", err));

app.get("/", (req, res) => {
  res.send("Backend ishlayapti 🚀");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ${process.env.PORT} portda ishlayapti`);
});
