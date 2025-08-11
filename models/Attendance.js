import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      present: { type: Boolean, required: true }
    }
  ],
  createdBy: { // teacher
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
