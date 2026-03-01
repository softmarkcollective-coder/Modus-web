export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-10">

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Modus
          </p>
          <h1 className="text-4xl font-semibold bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-neutral-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <p>
            This Privacy Policy describes how Modus ("the App"), operated by Softmark Collective (CVR: 35989323), collects, uses, and protects your information.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>We may collect the following information:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Email address (for account login)</li>
            <li>Event information created by the user</li>
            <li>Guest names entered into events</li>
            <li>Purchase validation data for Pro features</li>
          </ul>
          <p>
            We do not collect sensitive personal data. We do not use tracking technologies or advertising identifiers.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">2. How We Use Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To provide and operate the App</li>
            <li>To store event and seating data securely</li>
            <li>To validate Pro purchases</li>
            <li>To provide customer support</li>
          </ul>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">3. Data Storage & Security</h2>
          <p>
            Data is securely stored using Supabase infrastructure. The App is hosted on Vercel.
          </p>
          <p>
            We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">4. In-App Purchases</h2>
          <p>
            Modus offers a one-time Pro purchase (39 DKK). Payment processing is handled securely by Apple via the App Store.
          </p>
          <p>
            We do not store credit card details or payment information.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">5. Data Retention & Deletion</h2>
          <p>
            Users may request deletion of their account and associated data by contacting us at:
          </p>
          <p className="text-[#d6b25e]">
            softmarkcollective@gmail.com
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">6. Third-Party Services</h2>
          <p>
            We rely on trusted infrastructure providers:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Supabase (data storage)</li>
            <li>Vercel (hosting)</li>
            <li>Apple App Store (payments)</li>
          </ul>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">7. Contact</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact:
          </p>
          <p className="text-[#d6b25e]">
            softmarkcollective@gmail.com
          </p>
        </section>

      </div>
    </div>
  );
}