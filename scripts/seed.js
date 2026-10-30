/**
 * Seed script — run with: node scripts/seed.js
 * Demonstrates: CRUD Operations, Database Integration, Environment Variables
 *
 * Creates:
 *  - 1 admin user     (admin@cybetron.in / admin123)
 *  - 1 officer user   (officer@cybetron.in / officer123)
 *  - 1 regular user   (user@cybetron.in / user123)
 *  - 10 sample reports
 */

import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join }  from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cybetron";

// ── Inline schemas (avoid Next.js import issues) ─────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    name: String, email: { type: String, unique: true },
    password: String, phone: String,
    role: { type: String, default: "user" },
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
    incidentDate:     Date,
    incidentLocation: String,
    views:            { type: Number, default: 0 },
    financialLoss:    { amount: { type: Number, default: 0 }, currency: { type: String, default: "INR" } },
  },
  { timestamps: true }
);

// ── Sample data ──────────────────────────────────────────────────────────────
const sampleReports = [
  { title: "Received phishing email pretending to be SBI",        crimeType: "phishing",       severity: "high",     description: "I received an email claiming to be from SBI asking me to verify my net banking credentials. The link redirected to a fake website that stole my login details and Rs 45,000 was debited from my account within an hour.", incidentLocation: "Mumbai, Maharashtra" },
  { title: "Instagram account hacked and ransom demanded",         crimeType: "hacking",        severity: "medium",   description: "My Instagram account with 15k followers was hacked. The attacker changed my email and password, then demanded Rs 10,000 via UPI to return access. I never paid but lost the account.", incidentLocation: "Bengaluru, Karnataka" },
  { title: "Fake job offer fraud — lost Rs 1.2 lakh",             crimeType: "online_fraud",   severity: "critical", description: "I was contacted on LinkedIn with a data entry job offer. After paying Rs 1.2 lakh as a security deposit for a laptop, the company disappeared. Phone numbers are switched off.", incidentLocation: "Delhi, NCR" },
  { title: "Cyberbullying and morphed photos on social media",    crimeType: "cyberbullying",  severity: "high",     description: "My photographs were morphed using AI and posted on adult websites. The perpetrator is sending these images to my colleagues and family members demanding money.", incidentLocation: "Hyderabad, Telangana" },
  { title: "Ransomware locked all files on my business computer", crimeType: "ransomware",     severity: "critical", description: "All files on our office server were encrypted overnight. A ransom note appeared demanding 0.5 BTC. We have 5 years of business data at risk including client records.", incidentLocation: "Pune, Maharashtra" },
  { title: "Identity theft — loan taken in my name",              crimeType: "identity_theft", severity: "critical", description: "I discovered a personal loan of Rs 3 lakh taken in my name from an NBFC. My Aadhaar and PAN details were apparently used without my knowledge or consent.", incidentLocation: "Chennai, Tamil Nadu" },
  { title: "Phishing SMS claiming KYC expiry",                    crimeType: "phishing",       severity: "medium",   description: "Received SMS claiming my bank KYC expired and asking to click a link. The link looked exactly like my bank's website. My OTP was captured and Rs 8,000 was debited.", incidentLocation: "Kolkata, West Bengal" },
  { title: "Online shopping fraud — received empty box",          crimeType: "online_fraud",   severity: "low",      description: "Ordered an iPhone 15 for Rs 45,000 from a fake website that appeared in Google Ads. Received an empty box. Website is now offline and phone numbers disconnected.", incidentLocation: "Jaipur, Rajasthan" },
  { title: "Data breach — employee personal data leaked",         crimeType: "data_breach",    severity: "high",     description: "Our HR system was breached and personal data of 500+ employees including Aadhaar numbers, salary details, and bank accounts was found for sale on dark web forums.", incidentLocation: "Noida, Uttar Pradesh" },
  { title: "WhatsApp account hijacked via OTP scam",              crimeType: "hacking",        severity: "medium",   description: "Someone called claiming to be a WhatsApp support agent and asked for the OTP I received. I shared it and immediately lost access to my WhatsApp, which was then used to scam my contacts.", incidentLocation: "Ahmedabad, Gujarat" },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);

  const User   = mongoose.models.User   || mongoose.model("User",   UserSchema);
  const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

  // Clear existing
  await User.deleteMany({});
  await Report.deleteMany({});
  console.log("🗑️  Cleared existing data");

  // Hash passwords
  const salt = await bcrypt.genSalt(12);
  const [adminHash, officerHash, userHash] = await Promise.all([
    bcrypt.hash("admin123",   salt),
    bcrypt.hash("officer123", salt),
    bcrypt.hash("user123",    salt),
  ]);

  // Create users
  const [admin, officer, regularUser] = await User.insertMany([
    { name: "Admin User",    email: "admin@cybetron.in",   password: adminHash,   role: "admin",   phone: "+91 11 2345 6789" },
    { name: "Raj Officer",   email: "officer@cybetron.in", password: officerHash, role: "officer", phone: "+91 22 3456 7890" },
    { name: "Priya Sharma",  email: "user@cybetron.in",    password: userHash,    role: "user",    phone: "+91 98765 43210" },
  ]);
  console.log("👤 Created 3 users");

  // Create reports
  const statuses  = ["pending", "investigating", "resolved", "pending", "investigating"];
  const reportDocs = sampleReports.map((r, i) => ({
    ...r,
    reportId:     `CYB-2024-${String(i + 1).padStart(5, "0")}`,
    reporter:     i % 3 === 0 ? regularUser._id : null,
    isAnonymous:  i % 3 !== 0,
    incidentDate: new Date(Date.now() - (i + 1) * 86400000 * 3),
    status:       statuses[i % statuses.length],
    views:        Math.floor(Math.random() * 200),
    financialLoss: { amount: [45000, 10000, 120000, 0, 0, 300000, 8000, 45000, 0, 0][i], currency: "INR" },
  }));

  await Report.insertMany(reportDocs);
  console.log("📝 Created 10 sample reports");

  console.log("\n✅ Seed complete!\n");
  console.log("── Login Credentials ──────────────────────");
  console.log("Admin:   admin@cybetron.in   / admin123");
  console.log("Officer: officer@cybetron.in / officer123");
  console.log("User:    user@cybetron.in    / user123");
  console.log("───────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

