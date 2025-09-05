import express from 'express';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { markStudentAsPaid } from '../utils/scheduler.js';
const router = express.Router();

// POST /api/payments — yangi to'lov qo'shish
router.post('/', async (req, res) => {
  try {
    const { studentId, amount, date, comment } = req.body;

    if (!studentId || !amount || !date) {
      return res.status(400).json({ error: 'Kerakli maydonlar to\'liq emas' });
    }

    // Studentni tekshirish
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student topilmadi' });
    }

    const payment = new Payment({
      studentId,
      amount,
      date: new Date(date),
      comment: comment || '',
    });

    await payment.save();

    // Studentning payment statusini "paid" ga o'zgartirish
    await markStudentAsPaid(studentId);

    res.status(201).json({
      message: 'To\'lov saqlandi va student statusi yangilandi',
      payment,
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        paymentStatus: 'paid'
      }
    });
  } catch (error) {
    console.error('To\'lov saqlashda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// GET /api/payments — barcha to'lovlarni olish (ixtiyoriy: filterlar qo'shishingiz mumkin)
router.get('/', async (req, res) => {
  try {
    const { studentId, month, year } = req.query;
    
    // Filter obyektini yaratish
    const filter = {};
    
    if (studentId) {
      filter.studentId = studentId;
    }
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const payments = await Payment.find(filter)
      .populate('studentId', 'firstName lastName phone paymentStatus') // kerakli student maydonlari bilan
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    console.error('To\'lovlarni olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// GET /api/payments/student/:studentId — muayyan studentning to'lovlari
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student topilmadi' });
    }

    const payments = await Payment.find({ studentId })
      .sort({ date: -1 });

    res.json({
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        phone: student.phone,
        paymentStatus: student.paymentStatus
      },
      payments
    });
  } catch (error) {
    console.error('Student to\'lovlarini olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// POST /api/payments/reset-all — barcha studentlarning payment statusini reset qilish (manual)
router.post('/reset-all', async (req, res) => {
  try {
    const { manualResetPaymentStatus } = await import('../utils/scheduler.js');
    
    const result = await manualResetPaymentStatus();
    
    res.json({
      message: 'Barcha studentlarning to\'lov statusi "not_paid" ga o\'zgartirildi',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Manual reset xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
