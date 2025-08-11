import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    startDate: { type: Date },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    weekDays: [{ type: String, required: true }], // Qo'shildi, majburiy
  },
  { timestamps: true }
);


export default mongoose.model("Course", courseSchema);
