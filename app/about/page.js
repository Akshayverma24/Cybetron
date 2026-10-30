
import Link from "next/link";

import {
  Shield,
  Users,
  BookOpen,
  HeartHandshake,
  Globe,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

import Footer from "@/components/Footer";

/**
 * About Page — Server Component
 * Demonstrates: SSG, Server Components, SEO
 */

export const metadata = {
  title: "About Cybertron",
  description:
    "Learn about Cybertron, a cybercrime complaint and FIR assistance portal designed to make cybercrime reporting simpler and more accessible.",
};

export const revalidate = 3600;

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Our Mission",
      color: "cyan",
      desc: "To make cybercrime reporting simpler and more accessible by providing users with a secure platform to submit complaints and understand the reporting process.",
    },
    {
      icon: Users,
      title: "Our Platform",
      color: "purple",
      desc: "Cybertron provides user registration, complaint submission, report tracking, and dedicated dashboards to help users manage their cybercrime complaints.",
    },
    {
      icon: HeartHandshake,
      title: "Our Commitment",
      color: "green",
      desc: "We aim to provide a user-friendly experience with clear information, privacy-conscious design, and organized complaint management.",
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      label: "IT Act, 2000",
      desc: "Information Technology Act of India",
      href: "https://www.indiacode.nic.in/",
    },
    {
      icon: Globe,
      label: "National Cyber Crime Portal",
      desc: "Official Government of India cybercrime reporting portal",
      href: "https://cybercrime.gov.in/",
    },
    {
      icon: Shield,
      label: "Data Protection",
      desc: "Digital Personal Data Protection framework",
      href: "https://www.meity.gov.in/",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20">

        {/* Hero Section */}
        <section className="hero-bg cyber-grid-bg py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 mb-6">
              <Shield className="h-10 w-10 text-cyan-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              About <span className="text-cyan-400">Cybertron</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Cybertron is a cybercrime complaint and FIR assistance portal
              designed to help users submit complaints, organize report
              information, and track complaint status through a simple
              digital platform.
            </p>

            <p className="text-sm text-slate-500 mt-5">
              Cybertron is an independent project and is not an official
              government website.
            </p>

          </div>
        </section>

        {/* Mission and Platform */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

              {features.map(({ icon: Icon, title, color, desc }) => (
                <div
                  key={title}
                  className={`glass rounded-xl p-8 border text-center ${
                    color === "cyan"
                      ? "border-cyan-500/20"
                      : color === "purple"
                      ? "border-purple-500/20"
                      : "border-green-500/20"
                  }`}
                >
                  <div
                    className={`inline-flex p-4 rounded-xl mb-6 ${
                      color === "cyan"
                        ? "bg-cyan-400/10 text-cyan-400"
                        : color === "purple"
                        ? "bg-purple-400/10 text-purple-400"
                        : "bg-green-400/10 text-green-400"
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {title}
                  </h3>

                  <p className="text-slate-400">
                    {desc}
                  </p>
                </div>
              ))}

            </div>

            {/* Platform Features */}
            <div className="mb-16">

              <h2 className="text-3xl font-black text-white text-center mb-10">
                What Cybertron Offers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {[
                  "Secure user registration and login",
                  "Cybercrime complaint submission",
                  "Complaint status tracking",
                  "User and admin dashboards",
                  "Organized report management",
                  "Access to useful cybercrime resources",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="glass rounded-xl p-5 border border-cyan-500/10 flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-cyan-400/10">
                      <Shield className="h-5 w-5 text-cyan-400" />
                    </div>

                    <p className="text-slate-300 font-medium">
                      {feature}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* Legal and Cybercrime Resources */}
            <div className="mb-16">

              <h2 className="text-3xl font-black text-white text-center mb-10">
                Useful Cybercrime Resources
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {resources.map(({ icon: Icon, label, desc, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-xl p-5 border border-slate-700/50 flex items-center gap-4 hover:border-cyan-400/40 transition-all"
                  >
                    <div className="p-3 rounded-lg bg-slate-700/50 text-slate-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm">
                        {label}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {desc}
                      </p>
                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 text-slate-600" />
                  </a>
                ))}

              </div>
            </div>

            {/* Contact Section */}
            <div className="glass rounded-2xl p-8 border border-cyan-500/15 text-center">

              <h2 className="text-2xl font-black text-white mb-4">
                Need Help?
              </h2>

              <p className="text-slate-400 mb-6">
                If you are a victim of cybercrime in India, you can report
                cybercrime through the official government portal or contact
                the national cybercrime helpline.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">

                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <span>
                    Helpline:{" "}
                    <strong className="text-white font-mono">1930</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="h-5 w-5 text-cyan-400" />
                  <a
                    href="https://cybercrime.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400"
                  >
                    Official Cybercrime Portal
                  </a>
                </div>

              </div>

              <Link
                href="/report/new"
                className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl transition-all"
              >
                Report a Crime Now
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
