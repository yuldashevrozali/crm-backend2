# 💰 Student Payment Status API - Misollar

Bu fayl Student payment statusini o'zgartirish uchun API misollarini o'z ichiga oladi.

## 📋 Student Payment Status API

### Base URL: `/api/students`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| PUT | `/api/students/:id/payment-status` | Student payment statusini o'zgartirish |
| GET | `/api/students/:id` | Bitta studentni olish |
| PUT | `/api/students/:id` | Studentni to'liq yangilash |

---

## 1️⃣ Payment Statusini O'zgartirish

### PUT `/api/students/:id/payment-status`

Bu API orqali studentning to'lov statusini `"paid"` yoki `"not_paid"` ga o'zgartirishingiz mumkin.

### Misollar:

#### 1. Studentni "To'lov qildi" ga o'zgartirish

```bash
curl -X PUT http://localhost:5000/api/students/STUDENT_ID/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "paid"
}'
```

**Response:**
```json
{
  "message": "Student payment statusi \"paid\" ga o'zgartirildi",
  "student": {
    "id": "689bff03cca85c000c6c6060",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "email": "akmal@example.com",
    "phone": "+998901234567",
    "paymentStatus": "paid",
    "course": {
      "_id": "6898a83a131040892bba096d",
      "name": "Web Development",
      "price": 2000000
    },
    "updatedAt": "2025-01-15T12:30:00.000Z"
  }
}
```

#### 2. Studentni "To'lov qilmadi" ga o'zgartirish

```bash
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "not_paid"
}'
```

**Response:**
```json
{
  "message": "Student payment statusi \"not_paid\" ga o'zgartirildi",
  "student": {
    "id": "689bff03cca85c000c6c6060",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "email": "akmal@example.com",
    "phone": "+998901234567",
    "paymentStatus": "not_paid",
    "course": {
      "_id": "6898a83a131040892bba096d",
      "name": "Web Development",
      "price": 2000000
    },
    "updatedAt": "2025-01-15T12:35:00.000Z"
  }
}
```

---

## 2️⃣ Haqiqiy Misol (Sizning Studentingiz Uchun)

Sizning `loop` nomli studentingiz uchun:

### Student ID: `689bff03cca85c000c6c6060`

#### To'lov qildi deb belgilash:

```bash
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "paid"
}'
```

#### To'lov qilmadi deb belgilash:

```bash
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "not_paid"
}'
```

---

## 3️⃣ JavaScript/Fetch Misoli

### Frontend uchun JavaScript kodi:

```javascript
// Student payment statusini o'zgartirish funksiyasi
async function updateStudentPaymentStatus(studentId, paymentStatus) {
  try {
    const response = await fetch(`http://localhost:5000/api/students/${studentId}/payment-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: paymentStatus // "paid" yoki "not_paid"
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Muvaffaqiyat:', data.message);
      console.log('📊 Student:', data.student);
      return data;
    } else {
      console.error('❌ Xatolik:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('❌ Network xatolik:', error);
    throw error;
  }
}

// Foydalanish misollari:

// 1. Studentni "to'lov qildi" deb belgilash
updateStudentPaymentStatus('689bff03cca85c000c6c6060', 'paid')
  .then(result => {
    alert('Student to\'lov qildi deb belgilandi!');
  })
  .catch(error => {
    alert('Xatolik: ' + error.message);
  });

// 2. Studentni "to'lov qilmadi" deb belgilash
updateStudentPaymentStatus('689bff03cca85c000c6c6060', 'not_paid')
  .then(result => {
    alert('Student to\'lov qilmadi deb belgilandi!');
  })
  .catch(error => {
    alert('Xatolik: ' + error.message);
  });
```

---

## 4️⃣ React Component Misoli

```jsx
import React, { useState } from 'react';

const StudentPaymentManager = ({ studentId }) => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);

  const updatePaymentStatus = async (status) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: status
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStudent(data.student);
        alert(data.message);
      } else {
        alert('Xatolik: ' + data.message);
      }
    } catch (error) {
      alert('Network xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-manager">
      <h3>To'lov Status Boshqaruvi</h3>
      
      {student && (
        <div className="student-info">
          <p><strong>Student:</strong> {student.firstName} {student.lastName}</p>
          <p><strong>Telefon:</strong> {student.phone}</p>
          <p><strong>Joriy Status:</strong> 
            <span className={student.paymentStatus === 'paid' ? 'paid' : 'unpaid'}>
              {student.paymentStatus === 'paid' ? '✅ To\'lov qildi' : '❌ To\'lov qilmadi'}
            </span>
          </p>
        </div>
      )}

      <div className="buttons">
        <button 
          onClick={() => updatePaymentStatus('paid')}
          disabled={loading}
          className="btn-paid"
        >
          {loading ? 'Yuklanmoqda...' : '✅ To\'lov Qildi'}
        </button>
        
        <button 
          onClick={() => updatePaymentStatus('not_paid')}
          disabled={loading}
          className="btn-unpaid"
        >
          {loading ? 'Yuklanmoqda...' : '❌ To\'lov Qilmadi'}
        </button>
      </div>
    </div>
  );
};

export default StudentPaymentManager;
```

---

## 5️⃣ Xato Holatlari

### 1. Noto'g'ri Payment Status

```bash
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "invalid_status"
}'
```

**Response (400 Bad Request):**
```json
{
  "message": "Payment status quyidagilardan biri bo'lishi kerak: paid, not_paid"
}
```

### 2. Student Topilmadi

```bash
curl -X PUT http://localhost:5000/api/students/invalid_id/payment-status \
-H "Content-Type: application/json" \
-d '{
  "paymentStatus": "paid"
}'
```

**Response (404 Not Found):**
```json
{
  "message": "O'quvchi topilmadi"
}
```

### 3. Payment Status Berilmadi

```bash
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{}'
```

**Response (400 Bad Request):**
```json
{
  "message": "Payment status talab qilinadi"
}
```

---

## 🎯 Qisqacha Xulosa

### API Endpoint:
```
PUT /api/students/:id/payment-status
```

### Request Body:
```json
{
  "paymentStatus": "paid" // yoki "not_paid"
}
```

### Haqiqiy Misol (Sizning studentingiz uchun):
```bash
# To'lov qildi
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{"paymentStatus": "paid"}'

# To'lov qilmadi
curl -X PUT http://localhost:5000/api/students/689bff03cca85c000c6c6060/payment-status \
-H "Content-Type: application/json" \
-d '{"paymentStatus": "not_paid"}'
```

Bu API orqali istalgan studentning to'lov statusini osongina boshqarishingiz mumkin! 🎉