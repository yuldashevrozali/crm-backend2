import express from "express";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * 📌 Barcha studentlarni olish
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("courseId", "name");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Yangi student qo‘shish
 */
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, courseId, paymentStatus } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !courseId || !paymentStatus) {
      return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi shart" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      courseId,
      paymentStatus,
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Studentni o‘chirish
 */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "O‘quvchi topilmadi" });
    }
    res.json({ message: "O‘quvchi o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Student parolini yangilash
 */
router.put("/:id/password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "Yangi parol talab qilinadi" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "O‘quvchi topilmadi" });
    }

    res.json({ message: "Parol yangilandi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Student payment statusini yangilash
 */
router.put("/:id/payment-status", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status talab qilinadi" });
    }

    // Valid payment status qiymatlarini tekshirish
    const validStatuses = ["paid", "not_paid"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: `Payment status quyidagilardan biri bo'lishi kerak: ${validStatuses.join(", ")}`
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate("courseId", "name price");

    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi" });
    }

    res.json({
      message: `Student payment statusi "${paymentStatus}" ga o'zgartirildi`,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        paymentStatus: student.paymentStatus,
        course: student.courseId,
        updatedAt: student.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Bitta studentni ID bo'yicha olish
 */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("courseId", "name price duration");

    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 Studentni to'liq yangilash
 */
router.put("/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      courseId,
      status,
      paymentStatus
    } = req.body;

    // Email unique ekanligini tekshirish
    if (email) {
      const existingStudent = await Student.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (existingStudent) {
        return res.status(400).json({ message: "Bu email bilan boshqa student mavjud" });
      }
    }

    // Course mavjudligini tekshirish
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Kurs topilmadi" });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        courseId,
        status,
        paymentStatus
      },
      { new: true }
    ).populate("courseId", "name price");

    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi" });
    }

    res.json({
      message: "Student ma'lumotlari yangilandi",
      student
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

export default router;
