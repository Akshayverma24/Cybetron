"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Shield, Menu, X, AlertTriangle, LayoutDashboard,
  FileText, LogOut, LogIn, UserPlus, User, ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Navbar Component
 * Demonstrates: Navigation, Client Components, Client-side Fetching
 */
export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [user,      setUser]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [dropdown,  setDropdown]  = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  // Fetch current session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) setUser(data.user);
        }
      } catch {}
      finally { setLoading(false); }
    }
    fetchSession();
  }, [pathname]); // re-check on route change

  async function handleLogout() {
    try {
      await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "logout" }),
      });
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  const navLinks = [
    { href: "/",             label: "Home",          icon: null },
    { href: "/reports",      label: "Reports",       icon: FileText },
    { href: "/report/new",   label: "File a Report", icon: AlertTriangle },
    { href: "/about",        label: "About",         icon: null },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 animate-ping-slow rounded-full bg-cyan-400/20" />
            </div>
            <span className="text-xl font-bold text-white">
              Cyber<span className="text-cyan-400 neon-text-blue">tron</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${pathname === href
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5"
                  }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            ))}

            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-400/10 transition-all">
                Admin
              </Link>
            )}
            {(user?.role === "officer" || user?.role === "admin") && (
              <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-400/10 transition-all">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 bg-slate-700/50 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div className="h-7 w-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${dropdown ? "rotate-180" : ""}`} />
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl border border-cyan-500/20 py-1 z-50">
                    <Link href="/dashboard" onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <hr className="border-cyan-500/10 my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-cyan-500/50 transition-all">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link href="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-semibold transition-all">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-cyan-500/10 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5">
              {label}
            </Link>
          ))}
          <hr className="border-cyan-500/10" />
          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10">
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm border border-slate-600 text-slate-300">Login</Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm bg-cyan-500 text-dark-900 font-semibold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

