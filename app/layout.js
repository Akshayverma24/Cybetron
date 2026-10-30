
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root Layout
 * Demonstrates:
 * - Next.js Root Layout
 * - Metadata API
 * - SEO Fundamentals
 * - Server Components
 */

export const metadata = {
  title: {
    default: "Cybetron | Cyber Crime Reporting Portal",
    template: "%s | Cybetron",
  },

  description:
    "Cybetron is India's cyber crime reporting portal. Report phishing, hacking, online fraud, identity theft and other cyber crimes securely.",

  keywords: [
    "cyber crime",
    "report cyber crime",
    "phishing",
    "online fraud",
    "cyberbullying",
    "hacking",
    "India cyber security",
  ],

  authors: [{ name: "Cybetron Team" }],
  creator: "Cybetron",

  metadataBase: new URL("http://localhost:3000"),

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "http://localhost:3000",
    title: "Cybetron | Cyber Crime Reporting Portal",
    description:
      "Report cyber crimes safely and securely with Cybetron.",
    siteName: "Cybetron",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cybetron | Cyber Crime Reporting Portal",
    description:
      "Report cyber crimes safely and securely with Cybetron.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-dark-900 text-slate-100 min-h-screen`}
      >
        <Navbar />

        <main className="min-h-screen">
          {children}
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1629",
              color: "#e2e8f0",
              border: "1px solid rgba(0,212,255,0.2)",
            },

            success: {
              iconTheme: {
                primary: "#00ff88",
                secondary: "#0f1629",
              },
            },

            error: {
              iconTheme: {
                primary: "#ff0055",
                secondary: "#0f1629",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
