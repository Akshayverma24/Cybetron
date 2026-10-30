import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Cybetron",
};

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400 mb-8">Effective: October 2024</p>

          <div className="glass rounded-2xl p-8 border border-cyan-500/10 space-y-6">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using Cybetron, you accept and agree to be bound by these
                Terms of Service and our Privacy Policy. If you do not agree, please do not
                use this portal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Permitted Use</h2>
              <ul className="text-slate-300 space-y-2 list-disc list-inside">
                <li>Report genuine cyber crimes you have personally experienced or witnessed</li>
                <li>Track the status of your submitted reports</li>
                <li>Communicate with assigned officers regarding your case</li>
                <li>Access publicly available information about cyber crime trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Prohibited Activities</h2>
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <ul className="text-slate-300 space-y-2 list-disc list-inside">
                  <li>Filing false, misleading, or fabricated reports</li>
                  <li>Impersonating another person or law enforcement officer</li>
                  <li>Attempting to access unauthorized areas of the system</li>
                  <li>Using the portal for harassment or defamation</li>
                  <li>Submitting spam, malware, or malicious content</li>
                </ul>
                <p className="text-red-400 text-sm mt-3 font-medium">
                  Violation may result in legal action under Section 182 IPC (false information) and the IT Act 2000.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Accuracy of Reports</h2>
              <p className="text-slate-300 leading-relaxed">
                You confirm that all information submitted is true and accurate to the best of
                your knowledge. Filing a knowingly false report is a criminal offence punishable
                under Section 182 of the Indian Penal Code.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed">
                All content, design, and functionality of Cybetron is the property of the
                Government of India / Ministry of Home Affairs. Unauthorized reproduction
                is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Disclaimers</h2>
              <p className="text-slate-300 leading-relaxed">
                Cybetron is provided &quot;as is&quot; without warranties of any kind. We do not
                guarantee the outcome of any investigation. Response times may vary based
                on case complexity and officer availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These terms are governed by the laws of India. Any disputes shall be subject
                to the exclusive jurisdiction of courts in New Delhi, India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
              <p className="text-slate-300">
                Legal queries: <a href="mailto:legal@cybetron.in" className="text-cyan-400">legal@cybetron.in</a>
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

