import cron from 'node-cron';
import Student from '../models/Student.js';

/**
 * Har oyning 1-kunida barcha studentlarning payment statusini "not_paid" ga o'zgartirish
 */
const resetMonthlyPaymentStatus = () => {
  // Har oyning 1-kuni soat 00:01 da ishga tushadi
  cron.schedule('1 0 1 * *', async () => {
    try {
      console.log('🔄 Oylik to\'lov statusini yangilash boshlandi...');
      
      const result = await Student.updateMany(
        { status: 'active' }, // Faqat faol studentlar uchun
        { paymentStatus: 'not_paid' }
      );
      
      console.log(`✅ ${result.modifiedCount} ta studentning to'lov statusi "not_paid" ga o'zgartirildi`);
      console.log(`📅 Sana: ${new Date().toLocaleString('uz-UZ')}`);
      
    } catch (error) {
      console.error('❌ Oylik to\'lov statusini yangilashda xatolik:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Tashkent"
  });
  
  console.log('📅 Oylik to\'lov status yangilash scheduler ishga tushirildi');
};

/**
 * Manual ravishda barcha studentlarning payment statusini reset qilish
 */
const manualResetPaymentStatus = async () => {
  try {
    console.log('🔄 Manual to\'lov statusini yangilash boshlandi...');
    
    const result = await Student.updateMany(
      { status: 'active' },
      { paymentStatus: 'not_paid' }
    );
    
    console.log(`✅ ${result.modifiedCount} ta studentning to'lov statusi "not_paid" ga o'zgartirildi`);
    return result;
    
  } catch (error) {
    console.error('❌ Manual to\'lov statusini yangilashda xatolik:', error);
    throw error;
  }
};

/**
 * To'lov qilinganda studentning statusini "paid" ga o'zgartirish
 */
const markStudentAsPaid = async (studentId) => {
  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { paymentStatus: 'paid' },
      { new: true }
    );
    
    if (!student) {
      throw new Error('Student topilmadi');
    }
    
    console.log(`✅ Student ${student.firstName} ${student.lastName} ning to'lov statusi "paid" ga o'zgartirildi`);
    return student;
    
  } catch (error) {
    console.error('❌ Student to\'lov statusini yangilashda xatolik:', error);
    throw error;
  }
};

/**
 * Keyingi oylik reset sanasini hisoblash
 */
const getNextResetDate = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
};

/**
 * Joriy oyda qancha kun qolganini hisoblash
 */
const getDaysUntilReset = () => {
  const now = new Date();
  const nextReset = getNextResetDate();
  const diffTime = nextReset - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export {
  resetMonthlyPaymentStatus,
  manualResetPaymentStatus,
  markStudentAsPaid,
  getNextResetDate,
  getDaysUntilReset
};