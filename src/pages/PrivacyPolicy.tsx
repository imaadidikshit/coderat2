import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CustomCursor, GradientMesh } from '../components/fx';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-indigo-500/30">
      <CustomCursor />
      <Navbar />
      
      <main className="relative pt-32 pb-24 px-6 max-w-[800px] mx-auto">
        <GradientMesh particles={false} />
        <h1 className="relative z-10 text-4xl md:text-5xl font-display font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-white/50 mb-12 text-sm uppercase tracking-widest">Last updated: June 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when using QA Copilot, including your GitHub repository metadata, test execution logs, and account details. We do not store your source code; we only process DOM snapshots and test assertions to provide our AI-healing capabilities.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to operate, maintain, and improve our services. Specifically, DOM snapshots are analyzed by our AI agents to heal broken locators and detect visual regressions. Your data is not used to train global AI models without your explicit consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. We utilize industry-standard encryption protocols for data at rest and in transit.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
