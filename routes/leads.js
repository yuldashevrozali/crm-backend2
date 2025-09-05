import express from "express";
import Lead from "../models/Lead.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * 📌 GET /api/leads - Barcha leadlarni olish (filtering va pagination bilan)
 */
router.get("/", async (req, res) => {
  try {
    const { 
      status, 
      interestedSubject, 
      source, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    // Filter obyektini yaratish
    const filter = {};
    
    if (status) filter.status = status;
    if (interestedSubject) filter.interestedSubject = interestedSubject;
    if (source) filter.source = source;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const leads = await Lead.find(filter)
      .populate("assignedTo", "firstName lastName")
      .populate("courseId", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(filter);

    res.json({
      leads,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalLeads: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 GET /api/leads/stats/overview - Lead statistikasi
 */
router.get("/stats/overview", async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "new" });
    const contactedLeads = await Lead.countDocuments({ status: "contacted" });
    const interestedLeads = await Lead.countDocuments({ status: "interested" });
    const acceptedLeads = await Lead.countDocuments({ status: "accepted" });
    const rejectedLeads = await Lead.countDocuments({ status: "rejected" });
    const enrolledLeads = await Lead.countDocuments({ status: "enrolled" });

    // Subject bo'yicha statistika
    const subjectStats = await Lead.aggregate([
      {
        $group: {
          _id: "$interestedSubject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Source bo'yicha statistika
    const sourceStats = await Lead.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        interested: interestedLeads,
        accepted: acceptedLeads,
        rejected: rejectedLeads,
        enrolled: enrolledLeads
      },
      subjectStats,
      sourceStats,
      conversionRate: totalLeads > 0 ? ((enrolledLeads / totalLeads) * 100).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 GET /api/leads/:id - Bitta leadni olish
 */
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "firstName lastName email phone")
      .populate("courseId", "name price duration");

    if (!lead) {
      return res.status(404).json({ message: "Lead topilmadi" });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 POST /api/leads - Yangi lead yaratish
 */
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      interestedSubject,
      source,
      notes,
      budget,
      preferredSchedule,
      assignedTo,
      courseId
    } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!firstName || !lastName || !phone || !interestedSubject) {
      return res.status(400).json({ 
        message: "Ism, familiya, telefon va qiziqish sohasi majburiy" 
      });
    }

    // Telefon raqami mavjudligini tekshirish
    const existingLead = await Lead.findOne({ phone });
    if (existingLead) {
      return res.status(400).json({ 
        message: "Bu telefon raqami bilan lead allaqachon mavjud" 
      });
    }

    // Email mavjudligini tekshirish (agar berilgan bo'lsa)
    if (email) {
      const existingEmailLead = await Lead.findOne({ email });
      if (existingEmailLead) {
        return res.status(400).json({ 
          message: "Bu email bilan lead allaqachon mavjud" 
        });
      }
    }

    // AssignedTo teacher mavjudligini tekshirish
    if (assignedTo) {
      const teacher = await Teacher.findById(assignedTo);
      if (!teacher) {
        return res.status(404).json({ message: "Tayinlangan o'qituvchi topilmadi" });
      }
    }

    // Course mavjudligini tekshirish
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Kurs topilmadi" });
      }
    }

    const lead = new Lead({
      firstName,
      lastName,
      phone,
      email,
      interestedSubject,
      source: source || "other",
      notes: notes || "",
      budget,
      preferredSchedule: preferredSchedule || "flexible",
      assignedTo,
      courseId
    });

    await lead.save();
    
    // Populate qilib qaytarish
    const populatedLead = await Lead.findById(lead._id)
      .populate("assignedTo", "firstName lastName")
      .populate("courseId", "name price");

    res.status(201).json({
      message: "Lead muvaffaqiyatli yaratildi",
      lead: populatedLead
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 PUT /api/leads/:id - Leadni yangilash
 */
router.put("/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      interestedSubject,
      status,
      source,
      notes,
      budget,
      preferredSchedule,
      assignedTo,
      courseId,
      followUpDate
    } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead topilmadi" });
    }

    // Telefon raqami boshqa leadda mavjudligini tekshirish
    if (phone && phone !== lead.phone) {
      const existingLead = await Lead.findOne({ phone, _id: { $ne: req.params.id } });
      if (existingLead) {
        return res.status(400).json({ 
          message: "Bu telefon raqami bilan boshqa lead mavjud" 
        });
      }
    }

    // Email boshqa leadda mavjudligini tekshirish
    if (email && email !== lead.email) {
      const existingEmailLead = await Lead.findOne({ email, _id: { $ne: req.params.id } });
      if (existingEmailLead) {
        return res.status(400).json({ 
          message: "Bu email bilan boshqa lead mavjud" 
        });
      }
    }

    // AssignedTo teacher mavjudligini tekshirish
    if (assignedTo) {
      const teacher = await Teacher.findById(assignedTo);
      if (!teacher) {
        return res.status(404).json({ message: "Tayinlangan o'qituvchi topilmadi" });
      }
    }

    // Course mavjudligini tekshirish
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Kurs topilmadi" });
      }
    }

    // Status o'zgarsa, contactedAt ni yangilash
    if (status && status !== lead.status && status === "contacted") {
      lead.contactedAt = new Date();
    }

    // Maydonlarni yangilash
    if (firstName) lead.firstName = firstName;
    if (lastName) lead.lastName = lastName;
    if (phone) lead.phone = phone;
    if (email !== undefined) lead.email = email;
    if (interestedSubject) lead.interestedSubject = interestedSubject;
    if (status) lead.status = status;
    if (source) lead.source = source;
    if (notes !== undefined) lead.notes = notes;
    if (budget !== undefined) lead.budget = budget;
    if (preferredSchedule) lead.preferredSchedule = preferredSchedule;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo;
    if (courseId !== undefined) lead.courseId = courseId;
    if (followUpDate !== undefined) lead.followUpDate = followUpDate;

    await lead.save();

    // Populate qilib qaytarish
    const updatedLead = await Lead.findById(lead._id)
      .populate("assignedTo", "firstName lastName")
      .populate("courseId", "name price");

    res.json({
      message: "Lead muvaffaqiyatli yangilandi",
      lead: updatedLead
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 PATCH /api/leads/:id/status - Lead statusini yangilash
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status majburiy" });
    }

    const validStatuses = ["new", "contacted", "interested", "accepted", "rejected", "enrolled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status quyidagilardan biri bo'lishi kerak: ${validStatuses.join(", ")}` 
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead topilmadi" });
    }

    const oldStatus = lead.status;
    lead.status = status;

    // Status o'zgarsa, contactedAt ni yangilash
    if (status === "contacted" && oldStatus !== "contacted") {
      lead.contactedAt = new Date();
    }

    // Notes qo'shish
    if (notes) {
      lead.notes = lead.notes ? `${lead.notes}\n\n[${new Date().toLocaleString()}] Status: ${oldStatus} -> ${status}\n${notes}` : notes;
    }

    await lead.save();

    res.json({
      message: `Lead statusi ${oldStatus} dan ${status} ga o'zgartirildi`,
      lead: await Lead.findById(lead._id)
        .populate("assignedTo", "firstName lastName")
        .populate("courseId", "name price")
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 POST /api/leads/:id/convert - Leadni studentga aylantirish
 */
router.post("/:id/convert", async (req, res) => {
  try {
    const { password, courseId } = req.body;

    if (!password || !courseId) {
      return res.status(400).json({ 
        message: "Parol va kurs ID majburiy" 
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead topilmadi" });
    }

    if (lead.status !== "accepted") {
      return res.status(400).json({ 
        message: "Faqat 'accepted' statusdagi leadlarni studentga aylantirish mumkin" 
      });
    }

    // Kurs mavjudligini tekshirish
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    // Email mavjudligini tekshirish
    if (!lead.email) {
      return res.status(400).json({ 
        message: "Leadda email bo'lishi kerak" 
      });
    }

    // Student yaratish
    const student = new Student({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      password: password,
      phone: lead.phone,
      courseId: courseId,
      status: "active",
      paymentStatus: "not_paid"
    });

    await student.save();

    // Lead statusini enrolled ga o'zgartirish
    lead.status = "enrolled";
    lead.courseId = courseId;
    lead.notes = lead.notes ? `${lead.notes}\n\n[${new Date().toLocaleString()}] Studentga aylantirildi (Student ID: ${student._id})` : `Studentga aylantirildi (Student ID: ${student._id})`;
    await lead.save();

    res.json({
      message: "Lead muvaffaqiyatli studentga aylantirildi",
      student: await Student.findById(student._id).populate("courseId", "name price"),
      lead: await Lead.findById(lead._id)
        .populate("assignedTo", "firstName lastName")
        .populate("courseId", "name price")
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

/**
 * 📌 DELETE /api/leads/:id - Leadni o'chirish
 */
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead topilmadi" });
    }

    res.json({ 
      message: "Lead muvaffaqiyatli o'chirildi",
      deletedLead: {
        id: lead._id,
        fullName: `${lead.firstName} ${lead.lastName}`,
        phone: lead.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});


export default router;