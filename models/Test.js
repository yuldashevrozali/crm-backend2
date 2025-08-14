import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length === 3;
      },
      message: 'Har bir savolda aniq 3 ta variant bo‘lishi shart',
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return this.options.includes(val);
      },
      message: 'To‘g‘ri javob variantlardan biri bo‘lishi kerak',
    },
  },
});

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 3;
      },
      message: 'Test kamida 3 ta savoldan iborat bo‘lishi kerak',
    },
  },
}, { timestamps: true });

export default mongoose.model('Test', TestSchema);
