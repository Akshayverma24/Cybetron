import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Cybetron",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">Last updated: October 2024</p>

          <div className="glass rounded-2xl p-8 border border-cyan-500/10 prose prose-invert max-w-none space-y-6">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p className="text-slate-300 leading-relaxed">
                Cybetron collects information you voluntarily provide when filing a report, creating
                an account, or contacting us. This includes your name, email address, phone number,
                and details of the cyber crime you wish to report. Anonymous reporting is fully
                supported — you may submit a report without providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <ul className="text-slate-300 space-y-2 list-disc list-inside">
                <li>To process and investigate your cyber crime report</li>
                <li>To communicate with you regarding your case status</li>
                <li>To improve portal functionality and services</li>
                <li>To comply with legal obligations under the IT Act 2000</li>
                <li>To generate anonymized statistics for public safety</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
              <p className="text-slate-300 leading-relaxed">
                All data is encrypted in transit using TLS 1.3 and at rest using AES-256
                encryption. Passwords are hashed using bcrypt with a work factor of 12.
                We employ regular security audits, penetration testing, and follow
                OWASP security guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Data Sharing</h2>
              <p className="text-slate-300 leading-relaxed">
                Your personal information is never sold to third parties. It may be shared
                with authorized law enforcement agencies and the Ministry of Home Affairs
                solely for the purpose of investigating the reported cyber crime.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
              <p className="text-slate-300 leading-relaxed">
                Report data is retained for a minimum of 7 years as required by Indian law.
                Account data is retained until you request deletion. You may request data
                deletion by emailing <a href="mailto:privacy@cybetron.in" className="text-cyan-400">privacy@cybetron.in</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
              <p className="text-slate-300 leading-relaxed">
                Under the Digital Personal Data Protection Act 2023, you have the right to
                access, correct, and erase your personal data. You may also nominate a
                person to exercise these rights on your behalf.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
              <p className="text-slate-300">
                For privacy concerns: <a href="mailto:privacy@cybetron.in" className="text-cyan-400">privacy@cybetron.in</a>
                <br />
                Data Protection Officer: Ministry of Home Affairs, New Delhi
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

