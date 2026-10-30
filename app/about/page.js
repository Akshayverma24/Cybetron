import Link from "next/link";
import {
  Shield, Users, BookOpen, HeartHandshake, Globe,
  Phone, Mail, CheckCircle, ArrowRight,
} from "lucide-react";
import Footer from "@/components/Footer";

/**
 * About Page — Server Component (Static Site Generation)
 * Demonstrates: SSG, Server Components, SEO
 */
export const metadata = {
  title: "About Cybetron",
  description: "Learn about Cybetron — India's trusted cyber crime reporting portal built to protect citizens.",
};

// SSG — build time generation
export const revalidate = 3600; // revalidate every hour

const team = [
  { name: "Dr. Priya Sharma",  role: "Director, Cyber Crime Division",   initials: "PS" },
  { name: "Rajesh Kumar",       role: "Senior Cyber Security Officer",     initials: "RK" },
  { name: "Anita Mishra",       role: "Digital Forensics Expert",         initials: "AM" },
  { name: "Mohammed Irfan",     role: "Network Security Analyst",         initials: "MI" },
];

const milestones = [
  { year: "2019", event: "Cybetron portal launched by Ministry of Home Affairs" },
  { year: "2020", event: "50,000 reports filed within first year" },
  { year: "2021", event: "National Cyber Helpline 1930 integrated" },
  { year: "2022", event: "Mobile app launched — 2M+ downloads" },
  { year: "2023", event: "AI-powered fraud detection system deployed" },
  { year: "2024", event: "24/7 real-time response system activated" },
];

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20">
        {/* Hero */}
        <section className="hero-bg cyber-grid-bg py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 mb-6">
              <Shield className="h-10 w-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              About <span className="text-cyan-400">Cybetron</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Cybetron is India&apos;s official cyber crime reporting portal, established under the
              Ministry of Home Affairs to provide every citizen a secure, accessible way to report
              and track cyber crimes.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Shield,         title: "Our Mission",   color: "cyan",
                  desc: "To make India the safest digital nation by providing every citizen a simple, secure platform to report and combat cyber crime." },
                { icon: Users,          title: "Our Team",      color: "purple",
                  desc: "Over 350 trained cyber officers, digital forensics experts, and network security analysts working 24/7 to investigate reports and bring criminals to justice." },
                { icon: HeartHandshake, title: "Our Commitment",color: "green",
                  desc: "Every report is treated with confidentiality, urgency, and respect. We are committed to updating victims at every step of the investigation." },
              ].map(({ icon: Icon, title, color, desc }) => (
                <div key={title} className={`glass rounded-xl p-8 border text-center ${
                  color === "cyan"   ? "border-cyan-500/20" :
                  color === "purple" ? "border-purple-500/20" : "border-green-500/20"
                }`}>
                  <div className={`inline-flex p-4 rounded-xl mb-6 ${
                    color === "cyan"   ? "bg-cyan-400/10 text-cyan-400" :
                    color === "purple" ? "bg-purple-400/10 text-purple-400" : "bg-green-400/10 text-green-400"
                  }`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400">{desc}</p>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div className="mb-16">
              <h2 className="text-3xl font-black text-white text-center mb-10">Our Journey</h2>
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20 hidden md:block" />
                <div className="space-y-6">
                  {milestones.map(({ year, event }, i) => (
                    <div key={year} className={`flex gap-6 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                        <div className={`glass rounded-xl p-4 border border-cyan-500/10 inline-block ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
                          <span className="text-cyan-400 font-mono font-bold">{year}</span>
                          <p className="text-slate-300 text-sm mt-1">{event}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex h-4 w-4 rounded-full bg-cyan-500 border-4 border-dark-900 z-10 flex-shrink-0" />
                      <div className="flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="mb-16">
              <h2 className="text-3xl font-black text-white text-center mb-10">Leadership Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {team.map(({ name, role, initials }) => (
                  <div key={name} className="glass rounded-xl p-6 border border-cyan-500/10 text-center cyber-card">
                    <div className="h-16 w-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mx-auto mb-4">
                      {initials}
                    </div>
                    <h3 className="text-white font-bold text-sm">{name}</h3>
                    <p className="text-slate-400 text-xs mt-1">{role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              {[
                { icon: BookOpen, label: "IT Act 2000",         desc: "Information Technology Act" },
                { icon: Globe,    label: "Cyber Laws India",    desc: "Indian Penal Code sections" },
                { icon: Shield,   label: "Data Protection",     desc: "Digital Personal Data Protection Act 2023" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="glass rounded-xl p-5 border border-slate-700/50 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-700/50 text-slate-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-slate-400 text-xs">{desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-600" />
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="glass rounded-2xl p-8 border border-cyan-500/15 text-center">
              <h2 className="text-2xl font-black text-white mb-4">Get In Touch</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <span>Emergency: <strong className="text-white font-mono">1930</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <a href="mailto:support@cybetron.in" className="hover:text-cyan-400">support@cybetron.in</a>
                </div>
              </div>
              <Link href="/report/new"
                className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl transition-all">
                Report a Crime Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

