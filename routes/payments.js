import express from 'express';
import Payment from '../models/Payment.js';
const router = express.Router();

// POST /api/payments — yangi to‘lov qo‘shish
router.post('/payments', async (req, res) => {
  try {
    const { studentId, amount, date, comment } = req.body;

    if (!studentId || !amount || !date) {
      return res.status(400).json({ error: 'Kerakli maydonlar to‘liq emas' });
    }

    const payment = new Payment({
      studentId,
      amount,
      date: new Date(date),
      comment: comment || '',
    });

    await payment.save();

    res.status(201).json({ message: 'To‘lov saqlandi', payment });
  } catch (error) {
    console.error('To‘lov saqlashda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// GET /api/payments — barcha to‘lovlarni olish (ixtiyoriy: filterlar qo‘shishingiz mumkin)
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'firstName lastName phone') // kerakli student maydonlari bilan
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    console.error('To‘lovlarni olishda xatolik:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
