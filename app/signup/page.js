"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * Signup Page — Client Component
 * Demonstrates: Form Handling, Form Validation, Client-side Fetching, Client Components
 */
export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "signup", ...data }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Account created! Welcome to Cybetron 🎉");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(json.message || "Signup failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (hasError) =>
    `w-full pl-10 pr-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all ${
      hasError ? "border-red-500" : "border-slate-700"
    }`;

  return (
    <div className="min-h-screen hero-bg cyber-grid-bg flex items-center justify-center px-4 pt-16 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join Cybetron — India&apos;s cyber crime portal</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 border border-cyan-500/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input placeholder="Rahul Sharma" className={fieldClass(errors.name)}
                  {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="email" placeholder="you@example.com" className={fieldClass(errors.email)}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Phone <span className="text-slate-500">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="tel" placeholder="+91 98765 43210" className={fieldClass(false)}
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type={showPass ? "text" : "password"} placeholder="At least 6 characters"
                  className={`${fieldClass(errors.password)} pr-10`}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="password" placeholder="Repeat password"
                  className={`${fieldClass(errors.confirmPassword)} pr-10`}
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (v) => v === password || "Passwords don't match",
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1 accent-cyan-500"
                {...register("terms", { required: "You must agree to the terms" })}
              />
              <label htmlFor="terms" className="text-sm text-slate-400">
                I agree to the{" "}
                <Link href="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating Account…" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

