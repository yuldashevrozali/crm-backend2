import express from 'express';
import { getNextResetDate, getDaysUntilReset, manualResetPaymentStatus } from '../utils/scheduler.js';
import Student from '../models/Student.js';

const router = express.Router();

/**
 * GET /api/scheduler/info - Scheduler haqida ma'lumot
 */
router.get('/info', async (req, res) => {
  try {
    const nextResetDate = getNextResetDate();
    const daysUntilReset = getDaysUntilReset();
    
    // Studentlar statistikasi
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const paidStudents = await Student.countDocuments({ 
      status: 'active', 
      paymentStatus: 'paid' 
    });
    const unpaidStudents = await Student.countDocuments({ 
      status: 'active', 
      paymentStatus: 'not_paid' 
    });

    res.json({
      scheduler: {
        nextResetDate: nextResetDate.toISOString(),
        nextResetDateFormatted: nextResetDate.toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        daysUntilReset,
        cronExpression: '1 0 1 * *', // Har oyning 1-kuni soat 00:01
        timezone: 'Asia/Tashkent'
      },
      statistics: {
        totalActiveStudents: totalStudents,
        paidStudents,
        unpaidStudents,
        paymentRate: totalStudents > 0 ? ((paidStudents / totalStudents) * 100).toFixed(2) : 0
      },
      message: `Keyingi to'lov status reset ${daysUntilReset} kundan keyin bo'ladi`
    });
  } catch (error) {
    console.error('Scheduler info olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * POST /api/scheduler/reset-now - Hoziroq barcha studentlarning payment statusini reset qilish
 */
router.post('/reset-now', async (req, res) => {
  try {
    const result = await manualResetPaymentStatus();
    
    res.json({
      message: 'Barcha faol studentlarning to\'lov statusi "not_paid" ga o\'zgartirildi',
      modifiedCount: result.modifiedCount,
      resetDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Manual reset xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * GET /api/scheduler/unpaid-students - To'lov qilmagan studentlar ro'yxati
 */
router.get('/unpaid-students', async (req, res) => {
  try {
    const unpaidStudents = await Student.find({ 
      status: 'active', 
      paymentStatus: 'not_paid' 
    })
    .populate('courseId', 'name price')
    .select('firstName lastName phone courseId createdAt')
    .sort({ createdAt: -1 });

    res.json({
      count: unpaidStudents.length,
      students: unpaidStudents
    });
  } catch (error) {
    console.error('To\'lov qilmagan studentlarni olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * GET /api/scheduler/paid-students - To'lov qilgan studentlar ro'yxati
 */
router.get('/paid-students', async (req, res) => {
  try {
    const paidStudents = await Student.find({ 
      status: 'active', 
      paymentStatus: 'paid' 
    })
    .populate('courseId', 'name price')
    .select('firstName lastName phone courseId createdAt')
    .sort({ createdAt: -1 });

    res.json({
      count: paidStudents.length,
      students: paidStudents
    });
  } catch (error) {
    console.error('To\'lov qilgan studentlarni olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;