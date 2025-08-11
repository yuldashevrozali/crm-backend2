// routes/attendance.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// ✅ Davomat qo‘shish
router.post("/", async (req, res) => {
  try {
    const { courseId, studentId, date, status } = req.body;

    const newAttendance = new Attendance({
      courseId,
      studentId,
      date,
      status,
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Barcha davomat yozuvlarini olish (filtrlash bilan)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.date) filter.date = req.query.date;

    const attendance = await Attendance.find(filter)
      .populate("courseId")
      .populate("studentId");

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Bitta davomat yozuvini olish
router.get("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("courseId")
      .populate("studentId");

    if (!attendance) return res.status(404).json({ error: "Topilmadi" });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Davomat yozuvini yangilash
router.put("/:id", async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Davomat yozuvini o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Topilmadi" });
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
