"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  User, Mail, Phone, Shield, Edit3, Save,
  X, Calendar, FileText, Clock, CheckCircle,
} from "lucide-react";
import { Button, Spinner, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import Footer from "@/components/Footer";

/**
 * Profile Page — Client Component
 * Demonstrates: Client Components, Client-side Fetching, Data Mutations,
 *               Form Handling, Protected Routes (via middleware)
 */
export default function ProfilePage() {
  const router = useRouter();
  const [user,     setUser]     = useState(null);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch current user session + stats
  useEffect(() => {
    async function load() {
      try {
        const [sessionRes, reportsRes] = await Promise.all([
          fetch("/api/auth"),
          fetch("/api/reports?myReports=true&limit=3"),
        ]);

        const sessionData = await sessionRes.json();
        if (!sessionData.authenticated) {
          router.push("/login?redirect=/profile");
          return;
        }

        setUser(sessionData.user);
        reset({
          name:  sessionData.user.name,
          phone: sessionData.user.phone || "",
        });

        const reportsData = await reportsRes.json();
        if (reportsData.success) {
          setStats(reportsData.pagination);
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, reset]);

  async function onSave(data) {
    setSaving(true);
    try {
      const res  = await fetch("/api/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setUser((u) => ({ ...u, ...data }));
        toast.success("Profile updated!");
        setEditing(false);
      } else {
        toast.error(json.message || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const roleColors = {
    admin:   "bg-purple-400/10 text-purple-400 border-purple-400/30",
    officer: "bg-blue-400/10   text-blue-400   border-blue-400/30",
    user:    "bg-cyan-400/10   text-cyan-400   border-cyan-400/30",
  };

  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 mb-8">
            <h1 className="text-3xl font-black text-white mb-1">My Profile</h1>
            <p className="text-slate-400">Manage your Cybetron account</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Avatar & Role */}
            <div className="space-y-4">
              {/* Avatar card */}
              <div className="glass rounded-xl p-6 border border-cyan-500/10 text-center">
                <div className="h-24 w-24 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-4xl mx-auto mb-4">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-white font-bold text-lg">{user?.name}</h2>
                <p className="text-slate-400 text-sm mb-3">{user?.email}</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleColors[user?.role] || roleColors.user}`}>
                  <Shield className="h-3 w-3" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>

              {/* Stats */}
              <div className="glass rounded-xl p-5 border border-cyan-500/10">
                <h3 className="text-white font-semibold mb-4 text-sm">Report Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <FileText className="h-4 w-4 text-cyan-400" /> Total Reports
                    </span>
                    <span className="text-white font-bold">{stats?.total ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4 text-yellow-400" /> Pending
                    </span>
                    <span className="text-yellow-400 font-bold">—</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-400" /> Resolved
                    </span>
                    <span className="text-green-400 font-bold">—</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass rounded-xl p-5 border border-cyan-500/10 space-y-2">
                <h3 className="text-white font-semibold mb-3 text-sm">Quick Links</h3>
                <a href="/report/new"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <FileText className="h-4 w-4 text-cyan-400" /> File New Report
                </a>
                <a href="/reports?myReports=true"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <Shield className="h-4 w-4 text-cyan-400" /> My Reports
                </a>
                <a href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <Calendar className="h-4 w-4 text-cyan-400" /> Dashboard
                </a>
              </div>
            </div>

            {/* Right — Edit Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal Info */}
              <div className="glass rounded-xl p-6 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-bold text-lg">Personal Information</h3>
                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditing(false); reset(); }}
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 text-sm cyber-input"
                          {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                          {...register("phone")}
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="primary" loading={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? "Saving…" : "Save Changes"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: User,  label: "Full Name",  value: user?.name  },
                      { icon: Mail,  label: "Email",      value: user?.email },
                      { icon: Phone, label: "Phone",      value: user?.phone || "Not provided" },
                      { icon: Shield,label: "Role",       value: user?.role  },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                        <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 flex-shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="text-white font-medium text-sm">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Security */}
              <div className="glass rounded-xl p-6 border border-cyan-500/10">
                <h3 className="text-white font-bold text-lg mb-5">Account Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-dark-800 border border-slate-700/50">
                    <div>
                      <p className="text-sm font-medium text-white">Password</p>
                      <p className="text-xs text-slate-400">Last changed: unknown</p>
                    </div>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 border border-cyan-500/30 rounded-lg hover:bg-cyan-400/10 transition-all">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-dark-800 border border-slate-700/50">
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-400">Add extra security to your account</p>
                    </div>
                    <span className="text-xs text-yellow-400 font-medium px-2.5 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                      Not Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-400/5 border border-green-500/20">
                    <div>
                      <p className="text-sm font-medium text-white">Account Status</p>
                      <p className="text-xs text-slate-400">Your account is in good standing</p>
                    </div>
                    <span className="text-xs text-green-400 font-medium px-2.5 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                      Active ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

