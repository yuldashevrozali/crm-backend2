import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true,
      trim: true
    },
    lastName: { 
      type: String, 
      required: true,
      trim: true
    },
    phone: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: false,
      trim: true,
      lowercase: true
    },
    interestedSubject: { 
      type: String, 
      required: true,
      enum: [
        "Programming", 
        "Web Development", 
        "Mobile Development", 
        "Data Science", 
        "UI/UX Design", 
        "Digital Marketing",
        "English Language",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Other"
      ]
    },
    status: { 
      type: String, 
      enum: ["new", "contacted", "interested", "accepted", "rejected", "enrolled"], 
      default: "new" 
    },
    source: {
      type: String,
      enum: ["website", "social_media", "referral", "advertisement", "walk_in", "phone_call", "other"],
      default: "other"
    },
    notes: { 
      type: String, 
      default: "" 
    },
    contactedAt: { 
      type: Date 
    },
    followUpDate: { 
      type: Date 
    },
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Teacher",
      required: false
    },
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course",
      required: false
    },
    budget: {
      type: Number,
      required: false
    },
    preferredSchedule: {
      type: String,
      enum: ["morning", "afternoon", "evening", "weekend", "flexible"],
      default: "flexible"
    }
  },
  { 
    timestamps: true 
  }
);

// Index for better search performance
leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ interestedSubject: 1 });

// Virtual for full name
leadSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
leadSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model("Lead", leadSchema);