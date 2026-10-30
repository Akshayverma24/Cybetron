/**
 * Seed script (CommonJS) — run with: npm run seed
 * Demonstrates: CRUD Operations, Database Integration, Environment Variables
 *
 * Creates:
 *  - 1 admin user     (admin@cybetron.in  / admin123)
 *  - 1 officer user   (officer@cybetron.in / officer123)
 *  - 1 regular user   (user@cybetron.in   / user123)
 *  - 10 sample reports
 *
 * Usage: npm run seed
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env.local") });

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cybetron";

// ── Inline schemas ────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    name:       String,
    email:      { type: String, unique: true },
    password:   String,
    phone:      String,
    role:       { type: String, default: "user" },
    isVerified: { type: Boolean, default: true },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ReportSchema = new mongoose.Schema(
  {
    reportId:         { type: String, unique: true },
    title:            String,
    description:      String,
    crimeType:        String,
    severity:         { type: String, default: "medium" },
    status:           { type: String, default: "pending" },
    reporter:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAnonymous:      { type: Boolean, default: false },
    reporterName:     String,
    incidentDate:     Date,
    incidentLocation: String,
    views:            { type: Number, default: 0 },
    financialLoss: {
      amount:   { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    suspectInfo: {
      name: String, email: String, phone: String,
      website: String, ipAddress: String, socialMedia: String,
    },
    officerNotes: [{ note: String, addedAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

// ── Sample reports data ───────────────────────────────────────────────────────
const sampleReports = [
  {
    title:            "Received phishing email pretending to be SBI",
    crimeType:        "phishing",
    severity:         "high",
    incidentLocation: "Mumbai, Maharashtra",
    description:      "I received an email claiming to be from SBI asking me to verify my net banking credentials. The link redirected to a fake website that stole my login details and Rs 45,000 was debited from my account within an hour.",
    financialAmount:  45000,
    status:           "investigating",
  },
  {
    title:            "Instagram account hacked and ransom demanded",
    crimeType:        "hacking",
    severity:         "medium",
    incidentLocation: "Bengaluru, Karnataka",
    description:      "My Instagram account with 15k followers was hacked. The attacker changed my email and password, then demanded Rs 10,000 via UPI to return access. I never paid but lost the account permanently.",
    financialAmount:  0,
    status:           "pending",
  },
  {
    title:            "Fake job offer fraud — lost Rs 1.2 lakh",
    crimeType:        "online_fraud",
    severity:         "critical",
    incidentLocation: "Delhi, NCR",
    description:      "I was contacted on LinkedIn with a data entry job offer. After paying Rs 1.2 lakh as a security deposit for a laptop, the company disappeared. All phone numbers are switched off. Need urgent help.",
    financialAmount:  120000,
    status:           "investigating",
  },
  {
    title:            "Cyberbullying and morphed photos on social media",
    crimeType:        "cyberbullying",
    severity:         "high",
    incidentLocation: "Hyderabad, Telangana",
    description:      "My photographs were morphed using AI and posted on adult websites. The perpetrator is sending these images to my colleagues and family members demanding money to stop. This has been going on for 3 weeks.",
    financialAmount:  0,
    status:           "pending",
  },
  {
    title:            "Ransomware locked all files on business server",
    crimeType:        "ransomware",
    severity:         "critical",
    incidentLocation: "Pune, Maharashtra",
    description:      "All files on our office server were encrypted overnight. A ransom note appeared demanding 0.5 BTC (~Rs 21 lakhs). We have 5 years of business data at risk including all client records and financial data.",
    financialAmount:  0,
    status:           "investigating",
  },
  {
    title:            "Identity theft — loan of Rs 3 lakh taken in my name",
    crimeType:        "identity_theft",
    severity:         "critical",
    incidentLocation: "Chennai, Tamil Nadu",
    description:      "I discovered a personal loan of Rs 3 lakh taken in my name from an NBFC. My Aadhaar and PAN details were apparently used without my knowledge or consent. The EMIs are showing in my CIBIL report.",
    financialAmount:  300000,
    status:           "resolved",
  },
  {
    title:            "Phishing SMS claiming bank KYC expiry",
    crimeType:        "phishing",
    severity:         "medium",
    incidentLocation: "Kolkata, West Bengal",
    description:      "Received an SMS claiming my bank KYC had expired and asking me to click a link. The link looked identical to my bank's genuine website. My OTP was captured and Rs 8,000 was debited immediately.",
    financialAmount:  8000,
    status:           "resolved",
  },
  {
    title:            "Online shopping fraud — received empty box",
    crimeType:        "online_fraud",
    severity:         "low",
    incidentLocation: "Jaipur, Rajasthan",
    description:      "Ordered an iPhone 15 for Rs 45,000 from a fake website that appeared prominently in Google Ads. After payment the website is now offline and all phone numbers are disconnected. Delivery was an empty box.",
    financialAmount:  45000,
    status:           "pending",
  },
  {
    title:            "Company data breach — employee records leaked on dark web",
    crimeType:        "data_breach",
    severity:         "high",
    incidentLocation: "Noida, Uttar Pradesh",
    description:      "Our HR system was breached and personal data of 500+ employees including Aadhaar numbers, salary details, and bank accounts was found for sale on dark web forums. We need immediate assistance.",
    financialAmount:  0,
    status:           "investigating",
  },
  {
    title:            "WhatsApp account hijacked via fake OTP call",
    crimeType:        "hacking",
    severity:         "medium",
    incidentLocation: "Ahmedabad, Gujarat",
    description:      "Someone called claiming to be a WhatsApp support agent and asked for the OTP I received. I shared it thinking it was genuine and immediately lost access. The account was then used to scam my contacts for money.",
    financialAmount:  0,
    status:           "pending",
  },
];

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  console.log("\n🌱 Cybetron Database Seeder");
  console.log("══════════════════════════════\n");
  console.log("📡 Connecting to MongoDB…");

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to:", MONGODB_URI.replace(/\/\/.*@/, "//***@"));

  const User   = mongoose.models.User   || mongoose.model("User",   UserSchema);
  const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

  // Clear collections
  const [uDel, rDel] = await Promise.all([
    User.deleteMany({}),
    Report.deleteMany({}),
  ]);
  console.log(`🗑️  Cleared ${uDel.deletedCount} users, ${rDel.deletedCount} reports`);

  // Hash passwords
  const [adminHash, officerHash, userHash] = await Promise.all([
    bcrypt.hash("admin123",   12),
    bcrypt.hash("officer123", 12),
    bcrypt.hash("user123",    12),
  ]);

  // Create users
  const [admin, officer, regularUser] = await User.insertMany([
    {
      name: "Admin Cybetron",   email: "admin@cybetron.in",
      password: adminHash,       role: "admin",
      phone: "+91 11 2345 6789",
    },
    {
      name: "Raj Kumar (Officer)", email: "officer@cybetron.in",
      password: officerHash,    role: "officer",
      phone: "+91 22 3456 7890",
    },
    {
      name: "Priya Sharma",     email: "user@cybetron.in",
      password: userHash,       role: "user",
      phone: "+91 98765 43210",
    },
  ]);
  console.log("👤 Created 3 users (admin, officer, user)");

  // Create reports
  const reportDocs = sampleReports.map((r, i) => ({
    reportId:         `CYB-2024-${String(i + 1).padStart(5, "0")}`,
    title:            r.title,
    description:      r.description,
    crimeType:        r.crimeType,
    severity:         r.severity,
    status:           r.status,
    reporter:         i % 4 === 0 ? regularUser._id : null,
    isAnonymous:      i % 4 !== 0,
    reporterName:     i % 4 !== 0 ? null : "Priya Sharma",
    incidentDate:     new Date(Date.now() - (i + 1) * 86400000 * 2),
    incidentLocation: r.incidentLocation,
    financialLoss:    { amount: r.financialAmount, currency: "INR" },
    views:            Math.floor(Math.random() * 250 + 10),
  }));

  await Report.insertMany(reportDocs);
  console.log(`📝 Created ${reportDocs.length} sample reports`);

  console.log("\n✅ Seed complete!");
  console.log("══════════════════════════════");
  console.log("🔑 Login Credentials:");
  console.log("   Admin:   admin@cybetron.in   | admin123");
  console.log("   Officer: officer@cybetron.in | officer123");
  console.log("   User:    user@cybetron.in    | user123");
  console.log("══════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});

