"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button, Input } from "@/components/ui";

/**
 * Login Page — Client Component
 * Demonstrates: Client Components, Form Handling, Form Validation, Client-side Fetching
 */
export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "login", ...data }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success(`Welcome back, ${json.user.name}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(json.message || "Login failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen hero-bg cyber-grid-bg flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to access your Cybetron account</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 border border-cyan-500/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all ${
                    errors.email ? "border-red-500" : "border-slate-700"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all ${
                    errors.password ? "border-red-500" : "border-slate-700"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <LogIn className="h-4 w-4" />
              {loading ? "Logging in…" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign Up Free
              </Link>
            </p>
          </div>

          {/* Anonymous option */}
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <Link href="/report/new"
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
              Want to report anonymously?{" "}
              <span className="text-cyan-400">Skip login →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

