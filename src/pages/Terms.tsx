import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-[800px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-white/50 mb-12 text-sm uppercase tracking-widest">Last updated: June 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using QA Copilot, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>QA Copilot is an AI-powered quality assurance and test automation platform. We provide tools for executing, healing, and analyzing automated tests within your continuous integration pipelines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <p>You are responsible for safeguarding the password and tokens that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>In no event shall QA Copilot, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
