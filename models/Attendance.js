// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true // qidiruv uchun tezlashtirish
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // siz `Group` emas, `Course` nomidan foydalanyapsiz
    required: true
  },
  students: [
    {
      studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
      },
      present: { 
        type: Boolean, 
        required: true 
      }
    }
  ],
  createdBy: { // teacher
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, { timestamps: true });

// Har bir kunga, guruhga faqat bitta davomat bo'lishi uchun index
attendanceSchema.index({ groupId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);