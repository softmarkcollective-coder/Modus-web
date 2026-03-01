export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-10">

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Modus
          </p>
          <h1 className="text-4xl font-semibold bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-neutral-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <p>
            These Terms of Service ("Terms") govern your use of the Modus application ("the App"), operated by Softmark Collective (CVR: 35989323).
          </p>
          <p>
            By downloading or using the App, you agree to these Terms.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">1. License</h2>
          <p>
            Softmark Collective grants you a limited, non-exclusive, non-transferable license to use the App for personal or business event planning purposes.
          </p>
          <p>
            You may not copy, modify, distribute, reverse engineer, or resell the App.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">2. User Responsibility</h2>
          <p>
            You are responsible for all data entered into the App, including event information and guest details.
          </p>
          <p>
            You agree not to use the App for unlawful purposes.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">3. Pro Purchase</h2>
          <p>
            Modus offers a one-time Pro upgrade for 39 DKK. Payment is processed securely via Apple App Store.
          </p>
          <p>
            All payments are handled by Apple. Refund requests must be submitted directly to Apple according to their policies.
          </p>
          <p>
            Pro access is tied to your Apple account and may be restored using the “Restore Purchase” option.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">4. Limitation of Liability</h2>
          <p>
            The App is provided "as is" without warranties of any kind.
          </p>
          <p>
            Softmark Collective shall not be liable for any indirect, incidental, or consequential damages arising from use of the App.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to the App in case of misuse or violation of these Terms.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">6. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of Denmark.
          </p>
        </section>

        <section className="space-y-4 text-neutral-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">7. Contact</h2>
          <p>
            For questions regarding these Terms, please contact:
          </p>
          <p className="text-[#d6b25e]">
            softmarkcollective@gmail.com
          </p>
        </section>

      </div>
    </div>
  );
}