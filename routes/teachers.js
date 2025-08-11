import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// ✅ Barcha o‘qituvchilarni olish
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});

// ✅ Yangi o‘qituvchi qo‘shish
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, specialization, salary, experience, education, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Ism, familiya, email va parol kiritilishi shart" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      phone,
      specialization,
      salary,
      experience,
      education,
      password, // bu joyda oddiy parol keladi, model ichida hash bo‘ladi
    });

    await newTeacher.save();
    res.status(201).json({ message: "O‘qituvchi muvaffaqiyatli qo‘shildi" });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});


// ✅ O‘qituvchini ID bo‘yicha yangilash
router.put("/:id", async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "O‘qituvchi topilmadi" });
    }

    res.json({ message: "O‘qituvchi yangilandi", teacher: updatedTeacher });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});

// ✅ Parolni yangilash
router.put("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Yangi parol kiritilmadi" });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { password },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "O‘qituvchi topilmadi" });
    }

    res.json({ message: "Parol yangilandi" });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});

// ✅ O‘qituvchini ID bo‘yicha o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "O‘qituvchi topilmadi" });
    }

    res.json({ message: "O‘qituvchi o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});

export default router;
