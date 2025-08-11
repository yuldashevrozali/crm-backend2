import express from "express";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * 📌 Barcha kurslarni olish
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacherId", "firstName lastName email phone")
      .populate("studentIds", "firstName lastName email phone");

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 ID bo‘yicha kursni olish
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacherId", "firstName lastName email phone")
      .populate("studentIds", "firstName lastName email phone");

    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Yangi kurs yaratish
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, teacherId, startDate, weekDays } = req.body;

    if (!name || !price || !teacherId) {
      return res.status(400).json({
        message: "Kurs nomi, narxi, o‘qituvchi ID va o‘quv kunlari majburiy",
      });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "O‘qituvchi topilmadi" });
    }

    const course = new Course({
      name,
      description,
      price,
      teacherId,
      startDate,
      weekDays,
      studentIds: [],
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Kursni yangilash (to‘liq)
 */
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      teacherId,
      startDate,
      weekDays,
      studentIds,
    } = req.body;


    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        teacherId,
        startDate,
        weekDays,
        studentIds, // studentIds ham yangilash mumkin
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Kursni o‘chirish
 */
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    res.json({ message: "Kurs o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Kursga o‘qituvchi biriktirish
 */
router.patch("/:id/assign-teacher", async (req, res) => {
  try {
    const { teacherId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Kurs topilmadi" });

    if (course.teacherId) {
      return res
        .status(400)
        .json({ message: "Kursda allaqachon o‘qituvchi bor" });
    }

    course.teacherId = teacherId;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
});

/**
 * 📌 Kursga o‘quvchi qo‘shish
 */
router.patch("/:id/add-student", async (req, res) => {
  try {
    const { studentId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Kurs topilmadi" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "O‘quvchi topilmadi" });

    if (course.studentIds.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "O‘quvchi allaqachon kursda bor" });
    }

    course.studentIds.push(studentId);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
});

export default router;
