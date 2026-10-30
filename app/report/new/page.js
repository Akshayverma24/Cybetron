"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AlertTriangle, Shield, Calendar, MapPin, User,
  Globe, DollarSign, Eye, EyeOff, ChevronRight, ChevronLeft, CheckCircle,
} from "lucide-react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { CRIME_TYPES, SEVERITY_LEVELS } from "@/lib/utils";

/**
 * File Report Page — Client Component (multi-step form)
 * Demonstrates: Forms and Server Actions, Form Validation, Data Mutations,
 *               Optimistic UI Updates, Client Components
 */
export default function NewReportPage() {
  const router  = useRouter();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const totalSteps = 4;

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    defaultValues: { severity: "medium", crimeType: "other" },
  });

  async function nextStep() {
    const fieldsToValidate = {
      1: ["title", "crimeType", "severity", "incidentDate", "description"],
      2: [],
      3: anonymous ? [] : ["reporterName", "reporterEmail"],
    }[step] || [];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, totalSteps));
  }

  async function onSubmit(data) {
    setLoading(true);

    // Optimistic update: navigate first, show success
    toast.loading("Submitting your report…", { id: "submit" });

    try {
      const payload = {
        title:            data.title,
        description:      data.description,
        crimeType:        data.crimeType,
        severity:         data.severity,
        incidentDate:     data.incidentDate,
        incidentLocation: data.incidentLocation,
        isAnonymous:      anonymous,
        suspectInfo: {
          name:         data.suspectName,
          email:        data.suspectEmail,
          phone:        data.suspectPhone,
          website:      data.suspectWebsite,
          ipAddress:    data.suspectIp,
          socialMedia:  data.suspectSocial,
          otherDetails: data.suspectOther,
        },
        financialLoss: {
          amount:   parseFloat(data.lossAmount || "0"),
          currency: "INR",
        },
        reporterName:  data.reporterName,
        reporterEmail: data.reporterEmail,
        reporterPhone: data.reporterPhone,
      };

      const res  = await fetch("/api/reports", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Report filed! ID: ${json.report.reportId}`, { id: "submit", duration: 5000 });
        router.push(`/reports/${json.report._id}`);
      } else {
        toast.error(json.message || "Submission failed", { id: "submit" });
      }
    } catch {
      toast.error("Network error. Please try again.", { id: "submit" });
    } finally {
      setLoading(false);
    }
  }

  const progressPct = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid-bg pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-red-500/10 border border-red-500/30 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">File a Cyber Crime Report</h1>
          <p className="text-slate-400">All information is encrypted and confidential</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            {["Incident Details", "Suspect Info", "Your Details", "Review & Submit"].map((s, i) => (
              <span key={s} className={i + 1 === step ? "text-cyan-400 font-semibold" : i + 1 < step ? "text-green-400" : ""}>
                {i + 1 < step ? "✓ " : ""}{s}
              </span>
            ))}
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct + 33}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="glass rounded-2xl p-8 border border-cyan-500/15">

            {/* ── STEP 1: Incident Details ─────────────────────── */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" /> Incident Details
                </h2>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Report Title *</label>
                  <input placeholder="e.g. Got phishing email from fake SBI website"
                    className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all ${errors.title ? "border-red-500" : "border-slate-700"}`}
                    {...register("title", { required: "Title is required", minLength: { value: 5, message: "Min 5 chars" } })}
                  />
                  {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Crime Type *</label>
                    <select className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 text-sm cyber-input transition-all ${errors.crimeType ? "border-red-500" : "border-slate-700"}`}
                      {...register("crimeType", { required: true })}>
                      {CRIME_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Severity *</label>
                    <select className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 text-sm cyber-input"
                      {...register("severity")}>
                      {SEVERITY_LEVELS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Incident Date *</label>
                    <input type="date" max={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 text-sm cyber-input ${errors.incidentDate ? "border-red-500" : "border-slate-700"}`}
                      {...register("incidentDate", { required: "Date is required" })}
                    />
                    {errors.incidentDate && <p className="text-xs text-red-400">{errors.incidentDate.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Location</label>
                    <input placeholder="City, State" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("incidentLocation")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Description *</label>
                  <textarea rows={5} placeholder="Describe what happened in detail. Include how you were contacted, what information was compromised, how money was lost, etc."
                    className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input resize-none ${errors.description ? "border-red-500" : "border-slate-700"}`}
                    {...register("description", { required: "Description is required", minLength: { value: 20, message: "Please provide more detail (min 20 chars)" } })}
                  />
                  {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">
                    Financial Loss (₹) <span className="text-slate-500">(if any)</span>
                  </label>
                  <input type="number" min="0" placeholder="0"
                    className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                    {...register("lossAmount")}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2: Suspect Info ─────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-red-400" /> Suspect Information
                </h2>
                <p className="text-sm text-slate-400">Provide as much info as you know. All fields optional.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Suspect Name</label>
                    <input placeholder="Known name or alias" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectName")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Suspect Email</label>
                    <input type="email" placeholder="email@example.com" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectEmail")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                    <input placeholder="+91..." className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectPhone")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Website / URL</label>
                    <input placeholder="https://fakesite.com" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectWebsite")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">IP Address</label>
                    <input placeholder="192.168.x.x" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectIp")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Social Media Handle</label>
                    <input placeholder="@handle or profile URL" className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                      {...register("suspectSocial")} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Other Details</label>
                  <textarea rows={3} placeholder="Any additional suspect information..."
                    className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input resize-none"
                    {...register("suspectOther")} />
                </div>
              </div>
            )}

            {/* ── STEP 3: Reporter Details ─────────────────────── */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" /> Your Contact Details
                </h2>

                {/* Anonymous toggle */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-700 border border-slate-600/50">
                  <button type="button" onClick={() => setAnonymous(!anonymous)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${anonymous ? "bg-cyan-500" : "bg-slate-600"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${anonymous ? "left-7" : "left-1"}`} />
                  </button>
                  <div>
                    <p className="text-white font-medium text-sm">Submit Anonymously</p>
                    <p className="text-slate-400 text-xs">Your identity will not be stored or shared</p>
                  </div>
                  {anonymous && <EyeOff className="ml-auto h-5 w-5 text-cyan-400" />}
                </div>

                {!anonymous && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Full Name *</label>
                      <input placeholder="Your legal name"
                        className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input ${errors.reporterName ? "border-red-500" : "border-slate-700"}`}
                        {...register("reporterName", { required: anonymous ? false : "Name is required" })} />
                      {errors.reporterName && <p className="text-xs text-red-400">{errors.reporterName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Email Address *</label>
                      <input type="email" placeholder="your@email.com"
                        className={`w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input ${errors.reporterEmail ? "border-red-500" : "border-slate-700"}`}
                        {...register("reporterEmail", { required: anonymous ? false : "Email is required" })} />
                      {errors.reporterEmail && <p className="text-xs text-red-400">{errors.reporterEmail.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                      <input placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                        {...register("reporterPhone")} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Review ───────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" /> Review & Submit
                </h2>
                <p className="text-sm text-slate-400">Review your report before submitting. Once submitted, it will be reviewed by our team.</p>

                <div className="space-y-3">
                  {[
                    { label: "Title",      value: watch("title") },
                    { label: "Crime Type", value: CRIME_TYPES.find(c => c.value === watch("crimeType"))?.label },
                    { label: "Severity",   value: watch("severity")?.toUpperCase() },
                    { label: "Date",       value: watch("incidentDate") },
                    { label: "Anonymous",  value: anonymous ? "Yes" : "No" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 text-sm">{label}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/20 text-sm text-cyan-300">
                  <strong>Note:</strong> By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.
                  False reports may be subject to legal action.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button type="button" variant="primary" onClick={nextStep} className="flex-1">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" variant="danger" loading={loading} className="flex-1">
                  <AlertTriangle className="h-4 w-4" />
                  {loading ? "Submitting…" : "Submit Report"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

