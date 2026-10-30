import mongoose from "mongoose";

/**
 * Report Model
 * Demonstrates: ORM Basics, Data Validation, CRUD Operations
 */
const ReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    crimeType: {
      type: String,
      required: [true, "Crime type is required"],
      enum: [
        "phishing",
        "hacking",
        "identity_theft",
        "online_fraud",
        "cyberbullying",
        "ransomware",
        "data_breach",
        "child_safety",
        "other",
      ],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "closed", "rejected"],
      default: "pending",
    },
    // Reporter info
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = anonymous
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    reporterName: String,
    reporterEmail: String,
    reporterPhone: String,

    // Incident details
    incidentDate: {
      type: Date,
      required: [true, "Incident date is required"],
    },
    incidentLocation: {
      type: String,
      trim: true,
    },
    suspectInfo: {
      name: String,
      email: String,
      phone: String,
      website: String,
      ipAddress: String,
      socialMedia: String,
      otherDetails: String,
    },
    evidence: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    // Officer handling the case
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    officerNotes: [
      {
        note: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    // Victim financial loss if applicable
    financialLoss: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    // Views/tracking
    views: { type: Number, default: 0 },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Auto-generate reportId before saving
ReportSchema.pre("save", async function (next) {
  if (!this.reportId) {
    const count = await mongoose.models.Report.countDocuments();
    const year = new Date().getFullYear();
    this.reportId = `CYB-${year}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Index for fast search
ReportSchema.index({ crimeType: 1, status: 1 });
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ reporter: 1 });
ReportSchema.index({ reportId: 1 });

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;

