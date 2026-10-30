
"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Shield,
  Users,
  Globe,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

/* =========================
   BUTTON
========================= */

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-400 text-dark-900 focus:ring-cyan-500",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
    danger:
      "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500",
    outline:
      "border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 focus:ring-cyan-500",
    ghost:
      "text-slate-300 hover:text-white hover:bg-white/5 focus:ring-slate-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {children}
    </button>
  );
}

/* =========================
   INPUT
========================= */

export function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <input
        className={cn(
          "w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all",
          error
            ? "border-red-500 focus:border-red-400"
            : "border-slate-700 focus:border-cyan-400",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

/* =========================
   SELECT
========================= */

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <select
        className={cn(
          "w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 text-sm cyber-input transition-all",
          error
            ? "border-red-500"
            : "border-slate-700 focus:border-cyan-400",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

/* =========================
   TEXTAREA
========================= */

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <textarea
        className={cn(
          "w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input transition-all resize-none",
          error
            ? "border-red-500"
            : "border-slate-700 focus:border-cyan-400",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

/* =========================
   BADGE
========================= */

export function Badge({
  children,
  variant = "default",
  className,
}) {
  const variants = {
    default: "bg-slate-700/60 text-slate-300 border-slate-600/50",
    success: "bg-green-400/10 text-green-400 border-green-400/20",
    warning: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    danger: "bg-red-400/10 text-red-400 border-red-400/20",
    info: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
    purple: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  };

  return (
    <span
      className={cn(
        "text-xs px-2.5 py-0.5 rounded-full border font-medium",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

/* =========================
   CARD
========================= */

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 border border-cyan-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================
   SPINNER
========================= */

export function Spinner({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <svg
      className={cn(
        "animate-spin text-cyan-400",
        sizes[size] || sizes.md,
        className
      )}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* =========================
   STAT CARD
   Icons are received as strings
========================= */

const iconMap = {
  FileText,
  Shield,
  Users,
  Globe,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
};

export function StatCard({
  icon = "FileText",
  label,
  value,
  color = "cyan",
  trend,
}) {
  const Icon = iconMap[icon] || FileText;

  const colors = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    green: "text-green-400 bg-green-400/10 border-green-400/20",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  return (
    <div className="glass rounded-xl p-5 border border-cyan-500/10 cyber-card">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "p-2.5 rounded-lg border",
            colors[color] || colors.cyan
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {trend !== undefined && (
          <span
            className={`text-xs font-medium ${
              trend >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-white mb-1">
        {value}
      </p>

      <p className="text-sm text-slate-400">
        {label}
      </p>
    </div>
  );
}
