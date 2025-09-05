# 🚀 CRM Backend - Barcha API'lar uchun To'liq CRUD Misollar

Bu fayl loyihadagi barcha API'lar uchun to'liq CRUD operatsiyalarning misollarini o'z ichiga oladi.

## 📋 API'lar Ro'yxati

1. **[Leads API](#1️⃣-leads-api)** - Potentsial o'quvchilar
2. **[Students API](#2️⃣-students-api)** - O'quvchilar
3. **[Teachers API](#3️⃣-teachers-api)** - O'qituvchilar
4. **[Courses API](#4️⃣-courses-api)** - Kurslar
5. **[Attendances API](#5️⃣-attendances-api)** - Davomat
6. **[Payments API](#6️⃣-payments-api)** - To'lovlar
7. **[Tests API](#7️⃣-tests-api)** - Testlar
8. **[Auth API](#8️⃣-auth-api)** - Autentifikatsiya

---

## 1️⃣ LEADS API

### Base URL: `/api/leads`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/leads` | Barcha leadlarni olish |
| GET | `/api/leads/:id` | Bitta leadni olish |
| POST | `/api/leads` | Yangi lead yaratish |
| PUT | `/api/leads/:id` | Leadni yangilash |
| PATCH | `/api/leads/:id/status` | Lead statusini yangilash |
| POST | `/api/leads/:id/convert` | Leadni studentga aylantirish |
| DELETE | `/api/leads/:id` | Leadni o'chirish |
| GET | `/api/leads/stats/overview` | Lead statistikasi |

### CREATE - Yangi Lead Yaratish
```bash
curl -X POST http://localhost:5000/api/leads \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Akmal",
  "lastName": "Karimov",
  "phone": "+998901234567",
  "email": "akmal@example.com",
  "interestedSubject": "Programming",
  "source": "website",
  "notes": "Web development kursiga qiziqadi",
  "budget": 1500000,
  "preferredSchedule": "evening"
}'
```

### READ - Leadlarni O'qish
```bash
# Barcha leadlar
curl -X GET http://localhost:5000/api/leads

# Filtering bilan
curl -X GET "http://localhost:5000/api/leads?status=new&interestedSubject=Programming"

# Bitta lead
curl -X GET http://localhost:5000/api/leads/LEAD_ID
```

### UPDATE - Leadni Yangilash
```bash
curl -X PUT http://localhost:5000/api/leads/LEAD_ID \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Akmal",
  "lastName": "Karimov",
  "status": "contacted",
  "notes": "Telefon orqali bog'\''lanildi"
}'
```

### DELETE - Leadni O'chirish
```bash
curl -X DELETE http://localhost:5000/api/leads/LEAD_ID
```

---

## 2️⃣ STUDENTS API

### Base URL: `/api/students`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/students` | Barcha studentlarni olish |
| POST | `/api/students` | Yangi student qo'shish |
| PUT | `/api/students/:id/password` | Student parolini yangilash |
| DELETE | `/api/students/:id` | Studentni o'chirish |

### CREATE - Yangi Student Qo'shish
```bash
curl -X POST http://localhost:5000/api/students \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Dilshod",
  "lastName": "Abdullayev",
  "email": "dilshod@example.com",
  "password": "securePassword123",
  "phone": "+998907654321",
  "courseId": "COURSE_ID",
  "paymentStatus": "not_paid"
}'
```

**Response:**
```json
{
  "_id": "64f8b2c3d4e5f6789abcdef2",
  "firstName": "Dilshod",
  "lastName": "Abdullayev",
  "email": "dilshod@example.com",
  "phone": "+998907654321",
  "courseId": "COURSE_ID",
  "status": "active",
  "paymentStatus": "not_paid",
  "attendance": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### READ - Studentlarni O'qish
```bash
curl -X GET http://localhost:5000/api/students
```

### UPDATE - Student Parolini Yangilash
```bash
curl -X PUT http://localhost:5000/api/students/STUDENT_ID/password \
-H "Content-Type: application/json" \
-d '{
  "newPassword": "newSecurePassword456"
}'
```

### DELETE - Studentni O'chirish
```bash
curl -X DELETE http://localhost:5000/api/students/STUDENT_ID
```

---

## 3️⃣ TEACHERS API

### Base URL: `/api/teachers`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/teachers` | Barcha o'qituvchilarni olish |
| POST | `/api/teachers` | Yangi o'qituvchi qo'shish |
| PUT | `/api/teachers/:id` | O'qituvchini yangilash |
| PUT | `/api/teachers/:id/password` | O'qituvchi parolini yangilash |
| DELETE | `/api/teachers/:id` | O'qituvchini o'chirish |

### CREATE - Yangi O'qituvchi Qo'shish
```bash
curl -X POST http://localhost:5000/api/teachers \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Jasur",
  "lastName": "Toshmatov",
  "email": "jasur@example.com",
  "phone": "+998901111111",
  "specialization": "Web Development",
  "salary": 5000000,
  "experience": 3,
  "education": "Toshkent Axborot Texnologiyalari Universiteti",
  "password": "teacherPassword123"
}'
```

**Response:**
```json
{
  "message": "O'qituvchi muvaffaqiyatli qo'shildi"
}
```

### READ - O'qituvchilarni O'qish
```bash
curl -X GET http://localhost:5000/api/teachers
```

### UPDATE - O'qituvchini Yangilash
```bash
curl -X PUT http://localhost:5000/api/teachers/TEACHER_ID \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Jasur",
  "lastName": "Toshmatov",
  "specialization": "Full Stack Development",
  "salary": 6000000,
  "experience": 4
}'
```

### DELETE - O'qituvchini O'chirish
```bash
curl -X DELETE http://localhost:5000/api/teachers/TEACHER_ID
```

---

## 4️⃣ COURSES API

### Base URL: `/api/courses`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/courses` | Barcha kurslarni olish |
| GET | `/api/courses/:id` | Bitta kursni olish |
| POST | `/api/courses` | Yangi kurs yaratish |
| PUT | `/api/courses/:id` | Kursni yangilash |
| DELETE | `/api/courses/:id` | Kursni o'chirish |
| PATCH | `/api/courses/:id/assign-teacher` | Kursga o'qituvchi biriktirish |
| PATCH | `/api/courses/:id/add-student` | Kursga o'quvchi qo'shish |

### CREATE - Yangi Kurs Yaratish
```bash
curl -X POST http://localhost:5000/api/courses \
-H "Content-Type: application/json" \
-d '{
  "name": "Full Stack Development",
  "description": "React, Node.js va MongoDB bilan to'\''liq web development kursi",
  "price": 2000000,
  "teacherId": "TEACHER_ID",
  "startDate": "2024-02-01",
  "weekDays": ["mon", "wed", "fri"]
}'
```

**Response:**
```json
{
  "_id": "64f8b2c3d4e5f6789abcdef1",
  "name": "Full Stack Development",
  "description": "React, Node.js va MongoDB bilan to'liq web development kursi",
  "price": 2000000,
  "teacherId": "TEACHER_ID",
  "startDate": "2024-02-01T00:00:00.000Z",
  "weekDays": ["mon", "wed", "fri"],
  "studentIds": [],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### READ - Kurslarni O'qish
```bash
# Barcha kurslar
curl -X GET http://localhost:5000/api/courses

# Bitta kurs
curl -X GET http://localhost:5000/api/courses/COURSE_ID
```

### UPDATE - Kursni Yangilash
```bash
curl -X PUT http://localhost:5000/api/courses/COURSE_ID \
-H "Content-Type: application/json" \
-d '{
  "name": "Advanced Full Stack Development",
  "price": 2500000,
  "description": "Yangilangan kurs tavsifi"
}'
```

### PATCH - Kursga O'qituvchi Biriktirish
```bash
curl -X PATCH http://localhost:5000/api/courses/COURSE_ID/assign-teacher \
-H "Content-Type: application/json" \
-d '{
  "teacherId": "TEACHER_ID"
}'
```

### PATCH - Kursga O'quvchi Qo'shish
```bash
curl -X PATCH http://localhost:5000/api/courses/COURSE_ID/add-student \
-H "Content-Type: application/json" \
-d '{
  "studentId": "STUDENT_ID"
}'
```

### DELETE - Kursni O'chirish
```bash
curl -X DELETE http://localhost:5000/api/courses/COURSE_ID
```

---

## 5️⃣ ATTENDANCES API

### Base URL: `/api/attendances`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/attendances` | Barcha davomatlarni olish |
| POST | `/api/attendances` | Davomat saqlash |
| GET | `/api/attendances?groupId=...&date=...` | Muayyan kun va guruh uchun davomat |

### CREATE - Davomat Saqlash
```bash
curl -X POST http://localhost:5000/api/attendances \
-H "Content-Type: application/json" \
-d '{
  "date": "2024-01-15",
  "groupId": "COURSE_ID",
  "createdBy": "TEACHER_ID",
  "students": [
    {
      "studentId": "STUDENT_ID_1",
      "status": "present"
    },
    {
      "studentId": "STUDENT_ID_2", 
      "status": "absent"
    },
    {
      "studentId": "STUDENT_ID_3",
      "status": "late"
    }
  ]
}'
```

**Response:**
```json
{
  "message": "Davomat muvaffaqiyatli saqlandi",
  "attendance": {
    "_id": "64f8b2c3d4e5f6789abcdef3",
    "date": "2024-01-15T00:00:00.000Z",
    "groupId": "COURSE_ID",
    "createdBy": "TEACHER_ID",
    "students": [
      {
        "studentId": "STUDENT_ID_1",
        "status": "present"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### READ - Davomatlarni O'qish
```bash
# Barcha davomatlar
curl -X GET http://localhost:5000/api/attendances

# Muayyan guruh va sana uchun
curl -X GET "http://localhost:5000/api/attendances?groupId=COURSE_ID&date=2024-01-15"
```

---

## 6️⃣ PAYMENTS API

### Base URL: `/api/payments`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/payments` | Barcha to'lovlarni olish |
| POST | `/api/payments` | Yangi to'lov qo'shish |

### CREATE - Yangi To'lov Qo'shish
```bash
curl -X POST http://localhost:5000/api/payments \
-H "Content-Type: application/json" \
-d '{
  "studentId": "STUDENT_ID",
  "amount": 500000,
  "date": "2024-01-15",
  "comment": "Yanvar oyi uchun to'\''lov"
}'
```

**Response:**
```json
{
  "message": "To'lov saqlandi",
  "payment": {
    "_id": "64f8b2c3d4e5f6789abcdef4",
    "studentId": "STUDENT_ID",
    "amount": 500000,
    "date": "2024-01-15T00:00:00.000Z",
    "comment": "Yanvar oyi uchun to'lov",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### READ - To'lovlarni O'qish
```bash
curl -X GET http://localhost:5000/api/payments
```

---

## 7️⃣ TESTS API

### Base URL: `/api/tests`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/tests` | Barcha testlarni olish |
| POST | `/api/tests` | Yangi test yaratish |

### CREATE - Yangi Test Yaratish
```bash
curl -X POST http://localhost:5000/api/tests \
-H "Content-Type: application/json" \
-d '{
  "name": "JavaScript Asoslari Testi",
  "questions": [
    {
      "question": "JavaScript da o'\''zgaruvchi e'\''lon qilish uchun qaysi kalit so'\''z ishlatiladi?",
      "options": ["var", "let", "const", "Barchasi"],
      "correctAnswer": 3
    },
    {
      "question": "Array uzunligini qanday aniqlash mumkin?",
      "options": ["array.size", "array.length", "array.count", "array.total"],
      "correctAnswer": 1
    }
  ]
}'
```

**Response:**
```json
{
  "_id": "64f8b2c3d4e5f6789abcdef5",
  "name": "JavaScript Asoslari Testi",
  "questions": [
    {
      "question": "JavaScript da o'zgaruvchi e'lon qilish uchun qaysi kalit so'z ishlatiladi?",
      "options": ["var", "let", "const", "Barchasi"],
      "correctAnswer": 3
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### READ - Testlarni O'qish
```bash
curl -X GET http://localhost:5000/api/tests
```

---

## 8️⃣ AUTH API

### Base URL: `/api/auth`

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/login` | Tizimga kirish |

### LOGIN - Tizimga Kirish
```bash
# Student sifatida kirish
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "student@example.com",
  "password": "studentPassword123"
}'

# O'qituvchi sifatida kirish
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "teacher@example.com", 
  "password": "teacherPassword123"
}'

# Administrator sifatida kirish
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "yuldashevrozali08@gmail.com",
  "password": "20080901"
}'
```

**Response (Student):**
```json
{
  "user": {
    "_id": "STUDENT_ID",
    "name": "Dilshod Abdullayev",
    "email": "student@example.com",
    "role": "student"
  }
}
```

**Response (Teacher):**
```json
{
  "user": {
    "_id": "TEACHER_ID", 
    "name": "Jasur Toshmatov",
    "email": "teacher@example.com",
    "role": "teacher"
  }
}
```

**Response (Admin):**
```json
{
  "user": {
    "email": "yuldashevrozali08@gmail.com",
    "role": "administrator",
    "name": "Rozali Yuldashev"
  }
}
```

---

## 🔧 Umumiy Ma'lumotlar

### Server Manzili
```
Base URL: http://localhost:5000
```

### Content-Type
Barcha POST, PUT, PATCH so'rovlar uchun:
```
Content-Type: application/json
```

### Xato Javoblari
Barcha API'lar quyidagi formatda xato qaytaradi:
```json
{
  "message": "Xato tavsifi",
  "error": "Batafsil xato ma'lumoti (ixtiyoriy)"
}
```

### Status Kodlari
- `200` - Muvaffaqiyatli
- `201` - Yaratildi
- `400` - Noto'g'ri so'rov
- `401` - Ruxsatsiz
- `403` - Taqiqlangan
- `404` - Topilmadi
- `500` - Server xatosi

---

## 🚀 Postman Collection

Barcha API'larni Postman da sinash uchun quyidagi collection dan foydalaning:

```json
{
  "info": {
    "name": "CRM Backend APIs",
    "description": "To'liq CRM Backend API Collection"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ],
  "item": [
    {
      "name": "Leads",
      "item": [
        {
          "name": "Get All Leads",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/leads"
          }
        },
        {
          "name": "Create Lead",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/leads",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"phone\": \"+998901234567\",\n  \"interestedSubject\": \"Programming\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Students",
      "item": [
        {
          "name": "Get All Students",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/students"
          }
        },
        {
          "name": "Create Student",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/students",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"Student\",\n  \"email\": \"test@student.com\",\n  \"password\": \"password123\",\n  \"phone\": \"+998901234567\",\n  \"courseId\": \"COURSE_ID\",\n  \"paymentStatus\": \"not_paid\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📝 Eslatmalar

1. **ID'lar**: Barcha `STUDENT_ID`, `TEACHER_ID`, `COURSE_ID` kabi qiymatlarni haqiqiy MongoDB ObjectId bilan almashtiring.

2. **Vaqt Formati**: Barcha sanalar ISO 8601 formatida (`YYYY-MM-DD` yoki `YYYY-MM-DDTHH:mm:ss.sssZ`).

3. **Parollar**: Barcha parollar avtomatik ravishda hash qilinadi (bcrypt).

4. **Populate**: Ko'pgina GET so'rovlar bog'langan ma'lumotlarni populate qiladi.

5. **Validatsiya**: Har bir API o'z validatsiya qoidalariga ega.

Bu API'lar orqali to'liq CRM tizimini boshqarishingiz mumkin! 🎉