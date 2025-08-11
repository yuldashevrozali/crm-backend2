import express from 'express';
import Attendance from '../models/Attendance.js';
import Group from '../models/Course.js';

const router = express.Router();

// Davomat saqlash
router.post('/', async (req, res) => {
  try {
    const { date, groupId, students, createdBy } = req.body;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi" });
    }

    const todayWeekday = selectedDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    const now = new Date();
    const todayTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // 1️⃣ Agar schedule ichida bugun dars bo'lmasa
    if (!group.weekDays.includes(todayWeekday)) {
      return res.status(400).json({ message: "Bugun bu guruh uchun dars yo'q" });
    }

    // 2️⃣ Agar lesson_time bo'lsa — faqat shu vaqt ichida
    if (group.lesson_time) {
      const [start, end] = group.lesson_time.split('-'); // Masalan: "14:00-16:00"
      if (!(todayTime >= start && todayTime <= end)) {
        return res
          .status(400)
          .json({ message: "Davomat faqat dars vaqtida qilinadi" });
      }
    } else {
      // lesson_time yo'q bo'lsa — shu kunda faqat bir marta
      const existing = await Attendance.findOne({
        groupId,
        date: selectedDate
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Bu kun uchun davomat allaqachon saqlangan" });
      }
    }

    // Davomat saqlash yoki yangilash
    let attendance = await Attendance.findOne({
      groupId,
      date: selectedDate
    });

    if (attendance) {
      if (group.lesson_time) {
        attendance.students = students;
        await attendance.save();
        return res.json({ message: "Davomat yangilandi", attendance });
      }
      return res
        .status(400)
        .json({ message: "Bu kun uchun davomat allaqachon saqlangan" });
    }

    // Yangi yozuv
    attendance = new Attendance({
      date: selectedDate,
      groupId,
      students,
      createdBy
    });
    await attendance.save();

    res.json({ message: "Davomat saqlandi", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// Davomatlarni olish
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('groupId')
      .populate('students.studentId');
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

export default router;
