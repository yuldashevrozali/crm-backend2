import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // createdAt va updatedAt maydonlarini qo‘shadi
});

export default mongoose.model('Payment', PaymentSchema);
