import Link from "next/link";
import {
  Shield, AlertTriangle, FileText, Users, ChevronRight,
  Lock, Eye, Zap, Phone, Globe, CreditCard, ShieldAlert, UserX, Bug,
} from "lucide-react";
import Footer from "@/components/Footer";

/**
 * Home Page — Server Component (SSR)
 * Demonstrates: Server-Side Rendering, Metadata API, SEO, Server Components
 */
export const metadata = {
  title: "Home | Cybetron – Cyber Crime Reporting Portal",
  description:
    "Report cyber crimes including phishing, hacking, online fraud, identity theft and cyberbullying. Get help from India's trusted cyber crime portal.",
};

// Static stats — could be replaced with ISR data
const stats = [
  { label: "Reports Filed",    value: "24,500+", icon: FileText,     color: "cyan"   },
  { label: "Cases Resolved",   value: "18,200+", icon: Shield,       color: "green"  },
  { label: "Active Officers",  value: "350+",    icon: Users,        color: "purple" },
  { label: "States Covered",   value: "28",      icon: Globe,        color: "yellow" },
];

const crimeTypes = [
  { icon: Globe,      label: "Phishing",        desc: "Fake emails and websites stealing your data",    href: "/reports?crimeType=phishing"       },
  { icon: Bug,        label: "Hacking",          desc: "Unauthorized access to your accounts/systems",   href: "/reports?crimeType=hacking"         },
  { icon: UserX,      label: "Identity Theft",   desc: "Someone using your personal info fraudulently",  href: "/reports?crimeType=identity_theft"  },
  { icon: CreditCard, label: "Online Fraud",     desc: "Scams, fake shopping sites, UPI fraud",          href: "/reports?crimeType=online_fraud"    },
  { icon: ShieldAlert, label: "Cyberbullying",   desc: "Harassment, threats, or abuse online",           href: "/reports?crimeType=cyberbullying"   },
  { icon: Lock,       label: "Ransomware",       desc: "Malware locking your files for ransom",          href: "/reports?crimeType=ransomware"      },
];

const steps = [
  { n: "01", title: "Create an Account",     desc: "Register or report anonymously — your choice." },
  { n: "02", title: "Fill the Report Form",  desc: "Provide details about the crime, suspect, and evidence." },
  { n: "03", title: "Submit & Track",        desc: "Get a unique report ID and track your case status." },
  { n: "04", title: "Authorities Act",       desc: "Assigned officers investigate and update you in real time." },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative hero-bg cyber-grid-bg min-h-screen flex items-center pt-16">
        {/* Animated orbs */}
        <div className="absolute top-20 left-10  w-72 h-72 bg-cyan-500/5   rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-medium mb-8 animate-fade-in">
            <Shield className="h-4 w-4" />
            India&apos;s Official Cyber Crime Reporting Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
            Report Cyber Crime
            <br />
            <span className="text-cyan-400 neon-text-blue">Protect India</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Are you a victim of online fraud, phishing, hacking, or cyberbullying?
            File your complaint securely and let our officers take action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/report/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl text-lg transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
              <AlertTriangle className="h-5 w-5" />
              File a Report Now
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link href="/reports"
              className="inline-flex items-center gap-2 px-8 py-4 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-xl text-lg transition-all">
              <Eye className="h-5 w-5" />
              View Reports
            </Link>
          </div>

          {/* Emergency Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Phone className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">Emergency Helpline:</span>
            <span className="text-white font-mono text-lg">1930</span>
            <span className="text-slate-400 text-sm">• Available 24/7</span>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-xl p-6 text-center cyber-card border border-cyan-500/10">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  color === "cyan"   ? "bg-cyan-400/10   text-cyan-400"   :
                  color === "green"  ? "bg-green-400/10  text-green-400"  :
                  color === "purple" ? "bg-purple-400/10 text-purple-400" :
                                       "bg-yellow-400/10 text-yellow-400"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRIME TYPES ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Types of Cyber Crime
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Know what you&apos;re dealing with. Click any category to browse related reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {crimeTypes.map(({ icon: Icon, label, desc, href }) => (
              <Link key={label} href={href}
                className="glass rounded-xl p-6 cyber-card border border-cyan-500/10 group hover:border-cyan-500/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 group-hover:bg-cyan-400/20 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{label}</h3>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Filing a report takes less than 5 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative glass rounded-xl p-6 border border-cyan-500/10">
                <div className="text-5xl font-black text-cyan-400/20 font-mono mb-4">{n}</div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 text-cyan-400/40 h-6 w-6 z-10" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/report/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl text-lg transition-all">
              <Zap className="h-5 w-5" />
              Start Your Report
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: Lock,   color: "cyan",   title: "100% Secure",      desc: "End-to-end encrypted reports. Your data never shared without consent."          },
              { icon: Eye,    color: "green",  title: "Anonymous Reports", desc: "Don't want to reveal identity? File reports anonymously — fully supported."     },
              { icon: Shield, color: "purple", title: "Expert Response",   desc: "Trained cyber officers review every report and provide real-time updates."      },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className={`glass rounded-xl p-8 border cyber-card text-center
                ${color === "cyan" ? "border-cyan-500/20" : color === "green" ? "border-green-500/20" : "border-purple-500/20"}`}>
                <div className={`inline-flex p-4 rounded-xl mb-6
                  ${color === "cyan" ? "bg-cyan-400/10 text-cyan-400" : color === "green" ? "bg-green-400/10 text-green-400" : "bg-purple-400/10 text-purple-400"}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 border-t border-b border-cyan-500/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Don&apos;t Stay Silent. <span className="text-cyan-400">Report It.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Every report helps fight cyber crime. Your complaint could save thousands from becoming victims.
          </p>
          <Link href="/report/new"
            className="inline-flex items-center gap-2 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-black rounded-xl text-xl transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]">
            <AlertTriangle className="h-6 w-6" />
            Report Now — It&apos;s Free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

