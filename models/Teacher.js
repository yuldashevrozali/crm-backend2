import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  salary: Number,
  experience: Number,
  education: String,
  specialization: String,
  email: { type: String, unique: true },
  password: String
});

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Teacher', teacherSchema);
