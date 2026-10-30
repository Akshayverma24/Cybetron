import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Github, Twitter } from "lucide-react";

/**
 * Footer Component — Server Component (no client-side JS needed)
 * Demonstrates: Server Components
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-cyan-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-7 w-7 text-cyan-400" />
              <span className="text-xl font-bold">
                Cyber<span className="text-cyan-400">tron</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Cybetron is India&apos;s trusted cyber crime reporting portal. 
              We help citizens report cyber crimes safely, anonymously, and effectively.
              Your complaint drives action.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/",           label: "Home" },
                { href: "/reports",    label: "View Reports" },
                { href: "/report/new", label: "File a Report" },
                { href: "/about",      label: "About Us" },
                { href: "/login",      label: "Login" },
                { href: "/signup",     label: "Register" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>National Helpline: 1930</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <a href="mailto:support@cybetron.in" className="hover:text-cyan-400 transition-colors">
                  support@cybetron.in
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Ministry of Home Affairs, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-cyan-500/10 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {year} Cybetron. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

