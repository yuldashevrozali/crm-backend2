# 🎯 Leads API - To'liq CRUD Operatsiyalar va Misollar

Bu fayl Leads API uchun barcha CRUD operatsiyalarning to'liq misollarini o'z ichiga oladi.

## 📋 API Endpoints Ro'yxati

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/leads` | Barcha leadlarni olish (filtering, pagination) |
| GET | `/api/leads/:id` | Bitta leadni olish |
| POST | `/api/leads` | Yangi lead yaratish |
| PUT | `/api/leads/:id` | Leadni yangilash |
| PATCH | `/api/leads/:id/status` | Lead statusini yangilash |
| POST | `/api/leads/:id/convert` | Leadni studentga aylantirish |
| DELETE | `/api/leads/:id` | Leadni o'chirish |
| GET | `/api/leads/stats/overview` | Lead statistikasi |

---

## 1️⃣ CREATE - Yangi Lead Yaratish

### POST `/api/leads`

**Request Body:**
```json
{
  "firstName": "Akmal",
  "lastName": "Karimov",
  "phone": "+998901234567",
  "email": "akmal.karimov@gmail.com",
  "interestedSubject": "Programming",
  "source": "website",
  "notes": "Web development kursiga qiziqadi",
  "budget": 1500000,
  "preferredSchedule": "evening",
  "assignedTo": "64f8b2c3d4e5f6789abcdef0",
  "courseId": "64f8b2c3d4e5f6789abcdef1"
}
```

**Response (201 Created):**
```json
{
  "message": "Lead muvaffaqiyatli yaratildi",
  "lead": {
    "_id": "64f8b2c3d4e5f6789abcdef2",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "phone": "+998901234567",
    "email": "akmal.karimov@gmail.com",
    "interestedSubject": "Programming",
    "status": "new",
    "source": "website",
    "notes": "Web development kursiga qiziqadi",
    "budget": 1500000,
    "preferredSchedule": "evening",
    "assignedTo": {
      "_id": "64f8b2c3d4e5f6789abcdef0",
      "firstName": "Jasur",
      "lastName": "Toshmatov"
    },
    "courseId": {
      "_id": "64f8b2c3d4e5f6789abcdef1",
      "name": "Full Stack Development",
      "price": 2000000
    },
    "fullName": "Akmal Karimov",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Minimal Lead Yaratish
```json
{
  "firstName": "Dilshod",
  "lastName": "Abdullayev",
  "phone": "+998907654321",
  "interestedSubject": "Web Development"
}
```

---

## 2️⃣ READ - Leadlarni O'qish

### GET `/api/leads` - Barcha Leadlar

**Query Parameters:**
- `status` - Lead statusi bo'yicha filter
- `interestedSubject` - Fan bo'yicha filter
- `source` - Manba bo'yicha filter
- `page` - Sahifa raqami (default: 1)
- `limit` - Sahifadagi elementlar soni (default: 10)
- `search` - Ism, telefon, email bo'yicha qidiruv

**Misollar:**

1. **Barcha leadlar:**
```
GET /api/leads
```

2. **Yangi leadlar:**
```
GET /api/leads?status=new
```

3. **Programming faniga qiziquvchilar:**
```
GET /api/leads?interestedSubject=Programming
```

4. **Website orqali kelganlar:**
```
GET /api/leads?source=website
```

5. **Pagination bilan:**
```
GET /api/leads?page=2&limit=5
```

6. **Qidiruv:**
```
GET /api/leads?search=Akmal
```

7. **Kombinatsiya:**
```
GET /api/leads?status=interested&interestedSubject=Web Development&page=1&limit=10
```

**Response:**
```json
{
  "leads": [
    {
      "_id": "64f8b2c3d4e5f6789abcdef2",
      "firstName": "Akmal",
      "lastName": "Karimov",
      "phone": "+998901234567",
      "email": "akmal.karimov@gmail.com",
      "interestedSubject": "Programming",
      "status": "new",
      "source": "website",
      "notes": "Web development kursiga qiziqadi",
      "budget": 1500000,
      "preferredSchedule": "evening",
      "assignedTo": {
        "_id": "64f8b2c3d4e5f6789abcdef0",
        "firstName": "Jasur",
        "lastName": "Toshmatov"
      },
      "courseId": {
        "_id": "64f8b2c3d4e5f6789abcdef1",
        "name": "Full Stack Development",
        "price": 2000000
      },
      "fullName": "Akmal Karimov",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalLeads": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/api/leads/:id` - Bitta Lead

**Request:**
```
GET /api/leads/64f8b2c3d4e5f6789abcdef2
```

**Response:**
```json
{
  "_id": "64f8b2c3d4e5f6789abcdef2",
  "firstName": "Akmal",
  "lastName": "Karimov",
  "phone": "+998901234567",
  "email": "akmal.karimov@gmail.com",
  "interestedSubject": "Programming",
  "status": "new",
  "source": "website",
  "notes": "Web development kursiga qiziqadi",
  "budget": 1500000,
  "preferredSchedule": "evening",
  "assignedTo": {
    "_id": "64f8b2c3d4e5f6789abcdef0",
    "firstName": "Jasur",
    "lastName": "Toshmatov",
    "email": "jasur@example.com",
    "phone": "+998901111111"
  },
  "courseId": {
    "_id": "64f8b2c3d4e5f6789abcdef1",
    "name": "Full Stack Development",
    "price": 2000000,
    "duration": "6 months"
  },
  "fullName": "Akmal Karimov",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 3️⃣ UPDATE - Leadni Yangilash

### PUT `/api/leads/:id` - To'liq Yangilash

**Request:**
```
PUT /api/leads/64f8b2c3d4e5f6789abcdef2
```

**Request Body:**
```json
{
  "firstName": "Akmal",
  "lastName": "Karimov",
  "phone": "+998901234567",
  "email": "akmal.new@gmail.com",
  "interestedSubject": "Web Development",
  "status": "contacted",
  "source": "referral",
  "notes": "Telefon orqali bog'lanildi. Kursga qiziqadi.",
  "budget": 2000000,
  "preferredSchedule": "morning",
  "assignedTo": "64f8b2c3d4e5f6789abcdef3",
  "courseId": "64f8b2c3d4e5f6789abcdef4",
  "followUpDate": "2024-01-20T09:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Lead muvaffaqiyatli yangilandi",
  "lead": {
    "_id": "64f8b2c3d4e5f6789abcdef2",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "phone": "+998901234567",
    "email": "akmal.new@gmail.com",
    "interestedSubject": "Web Development",
    "status": "contacted",
    "source": "referral",
    "notes": "Telefon orqali bog'lanildi. Kursga qiziqadi.",
    "budget": 2000000,
    "preferredSchedule": "morning",
    "contactedAt": "2024-01-15T11:00:00.000Z",
    "followUpDate": "2024-01-20T09:00:00.000Z",
    "assignedTo": {
      "_id": "64f8b2c3d4e5f6789abcdef3",
      "firstName": "Malika",
      "lastName": "Nazarova"
    },
    "courseId": {
      "_id": "64f8b2c3d4e5f6789abcdef4",
      "name": "Frontend Development",
      "price": 1800000
    },
    "fullName": "Akmal Karimov",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### PATCH `/api/leads/:id/status` - Faqat Status Yangilash

**Request:**
```
PATCH /api/leads/64f8b2c3d4e5f6789abcdef2/status
```

**Request Body:**
```json
{
  "status": "interested",
  "notes": "Kursga juda qiziqadi. Keyingi hafta uchrashuv belgilandi."
}
```

**Response:**
```json
{
  "message": "Lead statusi contacted dan interested ga o'zgartirildi",
  "lead": {
    "_id": "64f8b2c3d4e5f6789abcdef2",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "status": "interested",
    "notes": "Telefon orqali bog'lanildi. Kursga qiziqadi.\n\n[1/15/2024, 11:30:00 AM] Status: contacted -> interested\nKursga juda qiziqadi. Keyingi hafta uchrashuv belgilandi.",
    "assignedTo": {
      "_id": "64f8b2c3d4e5f6789abcdef3",
      "firstName": "Malika",
      "lastName": "Nazarova"
    },
    "courseId": {
      "_id": "64f8b2c3d4e5f6789abcdef4",
      "name": "Frontend Development",
      "price": 1800000
    },
    "fullName": "Akmal Karimov",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

## 4️⃣ CONVERT - Leadni Studentga Aylantirish

### POST `/api/leads/:id/convert`

**Request:**
```
POST /api/leads/64f8b2c3d4e5f6789abcdef2/convert
```

**Request Body:**
```json
{
  "password": "securePassword123",
  "courseId": "64f8b2c3d4e5f6789abcdef4"
}
```

**Response:**
```json
{
  "message": "Lead muvaffaqiyatli studentga aylantirildi",
  "student": {
    "_id": "64f8b2c3d4e5f6789abcdef5",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "email": "akmal.new@gmail.com",
    "phone": "+998901234567",
    "courseId": {
      "_id": "64f8b2c3d4e5f6789abcdef4",
      "name": "Frontend Development",
      "price": 1800000
    },
    "status": "active",
    "paymentStatus": "not_paid",
    "attendance": 0,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "lead": {
    "_id": "64f8b2c3d4e5f6789abcdef2",
    "firstName": "Akmal",
    "lastName": "Karimov",
    "status": "enrolled",
    "notes": "Telefon orqali bog'lanildi. Kursga qiziqadi.\n\n[1/15/2024, 11:30:00 AM] Status: contacted -> interested\nKursga juda qiziqadi. Keyingi hafta uchrashuv belgilandi.\n\n[1/15/2024, 12:00:00 PM] Studentga aylantirildi (Student ID: 64f8b2c3d4e5f6789abcdef5)",
    "assignedTo": {
      "_id": "64f8b2c3d4e5f6789abcdef3",
      "firstName": "Malika",
      "lastName": "Nazarova"
    },
    "courseId": {
      "_id": "64f8b2c3d4e5f6789abcdef4",
      "name": "Frontend Development",
      "price": 1800000
    },
    "fullName": "Akmal Karimov",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## 5️⃣ DELETE - Leadni O'chirish

### DELETE `/api/leads/:id`

**Request:**
```
DELETE /api/leads/64f8b2c3d4e5f6789abcdef2
```

**Response:**
```json
{
  "message": "Lead muvaffaqiyatli o'chirildi",
  "deletedLead": {
    "id": "64f8b2c3d4e5f6789abcdef2",
    "fullName": "Akmal Karimov",
    "phone": "+998901234567"
  }
}
```

---

## 6️⃣ STATISTICS - Lead Statistikasi

### GET `/api/leads/stats/overview`

**Request:**
```
GET /api/leads/stats/overview
```

**Response:**
```json
{
  "overview": {
    "total": 150,
    "new": 45,
    "contacted": 30,
    "interested": 25,
    "accepted": 20,
    "rejected": 15,
    "enrolled": 15
  },
  "subjectStats": [
    {
      "_id": "Programming",
      "count": 45
    },
    {
      "_id": "Web Development",
      "count": 35
    },
    {
      "_id": "Mobile Development",
      "count": 25
    },
    {
      "_id": "UI/UX Design",
      "count": 20
    },
    {
      "_id": "Data Science",
      "count": 15
    },
    {
      "_id": "Other",
      "count": 10
    }
  ],
  "sourceStats": [
    {
      "_id": "website",
      "count": 60
    },
    {
      "_id": "social_media",
      "count": 40
    },
    {
      "_id": "referral",
      "count": 25
    },
    {
      "_id": "advertisement",
      "count": 15
    },
    {
      "_id": "walk_in",
      "count": 10
    }
  ],
  "conversionRate": "10.00"
}
```

---

## 🔧 Lead Model Maydonlari

| Maydon | Turi | Majburiy | Tavsif |
|--------|------|----------|--------|
| `firstName` | String | ✅ | Ism |
| `lastName` | String | ✅ | Familiya |
| `phone` | String | ✅ | Telefon raqami |
| `email` | String | ❌ | Email manzil |
| `interestedSubject` | String | ✅ | Qiziqish sohasi |
| `status` | String | ❌ | Lead statusi (default: "new") |
| `source` | String | ❌ | Lead manbasi (default: "other") |
| `notes` | String | ❌ | Qo'shimcha eslatmalar |
| `contactedAt` | Date | ❌ | Bog'lanilgan vaqt |
| `followUpDate` | Date | ❌ | Keyingi bog'lanish vaqti |
| `assignedTo` | ObjectId | ❌ | Tayinlangan o'qituvchi |
| `courseId` | ObjectId | ❌ | Kurs ID |
| `budget` | Number | ❌ | Byudjet |
| `preferredSchedule` | String | ❌ | Afzal ko'rgan vaqt |

## 📊 Status Qiymatlari

- `new` - Yangi lead
- `contacted` - Bog'lanilgan
- `interested` - Qiziqadi
- `accepted` - Qabul qilingan
- `rejected` - Rad etilgan
- `enrolled` - Ro'yxatdan o'tgan

## 🎯 Qiziqish Sohalari

- `Programming` - Dasturlash
- `Web Development` - Web ishlab chiqish
- `Mobile Development` - Mobil ishlab chiqish
- `Data Science` - Ma'lumotlar fani
- `UI/UX Design` - Dizayn
- `Digital Marketing` - Raqamli marketing
- `English Language` - Ingliz tili
- `Mathematics` - Matematika
- `Physics` - Fizika
- `Chemistry` - Kimyo
- `Other` - Boshqa

## 🌐 Lead Manbalari

- `website` - Veb-sayt
- `social_media` - Ijtimoiy tarmoqlar
- `referral` - Tavsiya
- `advertisement` - Reklama
- `walk_in` - Bevosita tashrif
- `phone_call` - Telefon qo'ng'irog'i
- `other` - Boshqa

## ⏰ Afzal Ko'rgan Vaqtlar

- `morning` - Ertalab
- `afternoon` - Tushdan keyin
- `evening` - Kechqurun
- `weekend` - Dam olish kunlari
- `flexible` - Moslashuvchan

---

## 🚀 Postman Collection

Barcha API endpointlarini Postman da sinash uchun quyidagi collection dan foydalaning:

```json
{
  "info": {
    "name": "Leads API",
    "description": "CRM Leads API Collection"
  },
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
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"phone\": \"+998901234567\",\n  \"interestedSubject\": \"Programming\"\n}"
        }
      }
    },
    {
      "name": "Update Lead Status",
      "request": {
        "method": "PATCH",
        "url": "{{baseUrl}}/api/leads/{{leadId}}/status",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"contacted\",\n  \"notes\": \"Telefon orqali bog'lanildi\"\n}"
        }
      }
    },
    {
      "name": "Convert Lead to Student",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/leads/{{leadId}}/convert",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"password\": \"securePassword123\",\n  \"courseId\": \"{{courseId}}\"\n}"
        }
      }
    },
    {
      "name": "Get Lead Stats",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/leads/stats/overview"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5001"
    }
  ]
}
```

Bu API orqali o'quv markazingiz uchun to'liq lead management tizimini boshqarishingiz mumkin! 🎉