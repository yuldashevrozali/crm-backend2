// routes/attendances.js
import express from 'express';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js'; // Group emas, Course
import Teacher from '../models/Teacher.js'; // Teacher tekshirish uchun

const router = express.Router();

// 🟢 POST /api/attendances — Davomat saqlash yoki yangilash
// 🟢 POST /api/attendances — Davomat saqlash yoki yangilash
router.post('/', async (req, res) => {
  try {
    const { date, groupId, students, createdBy } = req.body;

    // Validatsiya
    if (!date || !groupId || !Array.isArray(students) || !createdBy) {
      return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi kerak" });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Noto'g'ri sana" });
    }

    // Sana boshini olish
    selectedDate.setHours(0, 0, 0, 0);

    // Guruhni olish
    const group = await Course.findById(groupId).populate('teacherId');
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi" });
    }

    // O'qituvchining o'zi ekanligini tekshirish
    if (group.teacherId?._id.toString() !== createdBy) {
      return res.status(403).json({ message: "Sizda ushbu guruh uchun ruxsat yo'q" });
    }

    // ✅ Bugungi kunni "tue" formatda olish
    const todayWeekday = selectedDate
      .toLocaleDateString('en-US', { weekday: 'long' }) // "Tuesday"
      .slice(0, 3) // "Tue"

    console.log('todayWeekday:', todayWeekday); // "tue"
    console.log('group.weekDays:', group.weekDays); // ['mon', 'tue', 'wed']

    // ✅ 1. Dars bormi?
    if (!Array.isArray(group.weekDays) || !group.weekDays.includes(todayWeekday)) {
      return res.status(400).json({ message: "Bugun bu guruh uchun dars yo'q" });
    }

    // ... (qolgan kod)

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const todayTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // 2️⃣ Agar lesson_time mavjud bo'lsa — faqat shu vaqt oralig'ida
    if (group.lesson_time) {
      const [start, end] = group.lesson_time.split('-').map(t => t.trim());
      if (!start || !end) {
        return res.status(500).json({ message: "Guruhning dars vaqti noto'g'ri" });
      }

      if (todayTime < start || todayTime > end) {
        return res.status(400).json({ 
          message: `Davomatni faqat ${group.lesson_time} oralig'ida qilishingiz mumkin` 
        });
      }
    } 
    // 3️⃣ Agar lesson_time bo'lmasa — faqat 1 marta
    else {
      const existing = await Attendance.findOne({
        groupId,
        date: selectedDate
      });

      if (existing) {
        return res.status(400).json({ 
          message: "Bu kun uchun davomat allaqachon saqlangan" 
        });
      }
    }

    // 4️⃣ Davomatni yangilash yoki saqlash
    let attendance = await Attendance.findOne({ groupId, date: selectedDate });

    if (attendance) {
      // Davomat mavjud
      if (group.lesson_time) {
        // Agar lesson_time bor bo'lsa — yangilash mumkin
        attendance.students = students;
        await attendance.save();
        return res.json({ 
          message: "Davomat muvaffaqiyatli yangilandi", 
          attendance 
        });
      } else {
        // Agar lesson_time bo'lmasa — yangilash mumkin emas
        return res.status(400).json({ 
          message: "Bu kun uchun davomat allaqachon saqlangan (bitta marta)" 
        });
      }
    }

    // Yangi davomat yaratish
    attendance = new Attendance({
      date: selectedDate,
      groupId,
      students,
      createdBy
    });

    await attendance.save();

    res.status(201).json({ 
      message: "Davomat muvaffaqiyatli saqlandi", 
      attendance 
    });

  } catch (err) {
    console.error("Davomat saqlashda xato:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// 🟢 GET /api/attendances — Barcha davomatlarni olish
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('groupId', 'name') // guruh nomi
      .populate('createdBy', 'firstName lastName') // o'qituvchi
      .populate('students.studentId', 'firstName lastName phone') // o'quvchilar
      .sort({ date: -1 });

    res.json(attendances);
  } catch (err) {
    console.error("Davomat olishda xato:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// 🟢 GET /api/attendances?groupId=...&date=... — Davomatni tekshirish (frontend uchun)
router.get('/', async (req, res) => {
  try {
    const { groupId, date } = req.query;

    if (!groupId || !date) {
      return next(); // boshqa route'ga o'tish
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ groupId, date: selectedDate })
      .populate('students.studentId', 'firstName lastName phone');

    if (!attendance) {
      return res.json([]);
    }

    res.json([attendance]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

export default router;