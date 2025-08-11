// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Modellar
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Static foydalanuvchilar (admin va boss)
const staticUsers = {
  'yuldashevrozali08@gmail.com': {
    password: '20080901',
    role: 'administrator',
    name: 'Rozali Yuldashev',
  },
  'boss@hmail.com': {
    password: '55557777',
    role: 'boss',
    name: 'Boss User',
  },
};

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Email va parol kiritilganligini tekshirish
  if (!email || !password) {
    return res.status(400).json({ message: 'Email va parol kerak' });
  }

  try {
    // 1. Administrator yoki Bossmi?
    if (staticUsers[email]) {
      const user = staticUsers[email];
      if (password === user.password) {
        return res.json({
          user: {
            email: user.email,
            role: user.role,
            name: user.name,
          },
        });
      } else {
        return res.status(401).json({ message: 'Parol noto‘g‘ri' });
      }
    }

    // 2. Studentmi?
    let userDoc = await Student.findOne({ email });
    if (userDoc) {
      const isValid = await bcrypt.compare(password, userDoc.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Parol noto‘g‘ri' });
      }

      return res.json({
        user: {
          _id: userDoc._id,
          name: `${userDoc.firstName} ${userDoc.lastName}`,
          email: userDoc.email,
          role: 'student',
        },
      });
    }

    // 3. O'qituvchimi?
    userDoc = await Teacher.findOne({ email });
    if (userDoc) {
      const isValid = await bcrypt.compare(password, userDoc.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Parol noto‘g‘ri' });
      }

      return res.json({
        user: {
          _id: userDoc._id,
          name: `${userDoc.firstName} ${userDoc.lastName}`,
          email: userDoc.email,
          role: 'teacher',
        },
      });
    }

    // 4. Hech kim topilmadi
    return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
  } catch (error) {
    console.error('Login xatosi:', error);
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
  }
});

module.exports = router;