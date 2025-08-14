import express from 'express';
import Test from '../models/Test.js';
const router = express.Router();
// ✅ Barcha testlarni olish
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Yangi test yaratish
router.post('/', async (req, res) => {
  try {
    const { name, questions } = req.body;

    if (!name || !questions) {
      return res.status(400).json({ error: 'Test nomi va savollar kiritilishi kerak' });
    }

    // Modeldagi validatsiyani ishga tushirish uchun
    const newTest = new Test({ name, questions });
    await newTest.save();

    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
