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
// POST yangi kurs yaratish
// POST yangi kurs yaratish
router.post("/", async (req, res) => {
  try {
    const { name, description, price, teacherId, startDate, weekDays } = req.body;

    if (!name || !price || !teacherId || !weekDays || !weekDays.length) {
      return res.status(400).json({ message: "Kurs nomi, narxi, o‘qituvchi ID va o‘quv kunlari majburiy" });
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
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

// PUT kursni yangilash
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, teacherId, startDate, weekDays } = req.body;

    if (!weekDays || !weekDays.length) {
      return res.status(400).json({ message: "O‘quv kunlari majburiy" });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, description, price, teacherId, startDate, weekDays },
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
import express from "express";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import bcrypt from "bcryptjs";


// ✅ Barcha studentlarni olish
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("courseId", "name");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

// ✅ Yangi student qo‘shish
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, courseId, paymentStatus } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!firstName || !lastName || !email || !password || !phone || !courseId || !paymentStatus) {
      return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi shart" });
    }

    // Kursni tekshirish
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    const student = new Student({
      firstName,
      lastName,
      email,
      password,
      phone,
      courseId,
      paymentStatus
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

// ✅ Studentni o‘chirish
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

// PUT /api/courses/:id/add-student
router.put('/:id/add-student', async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { studentIds: studentId } }, // takrorlanmasin
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
});


// ✅ Parolni yangilash
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

// routes/courses.js yoki courses.ts
router.patch('/:id/assign-teacher', async (req, res) => {
  try {
    const { teacherId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });

    if (course.teacherId)
      return res.status(400).json({ message: 'Kursda allaqachon o‘qituvchi bor' });

    course.teacherId = teacherId;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi' });
  }
});




router.patch('/:id/add-student', async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Kurs topilmadi' });

    if (course.studentIds.includes(studentId))
      return res.status(400).json({ message: 'O‘quvchi allaqachon kursda bor' });

    course.studentIds.push(studentId);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi' });
  }
});


export default router;
