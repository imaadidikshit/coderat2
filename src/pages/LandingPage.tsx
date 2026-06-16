import { motion } from 'motion/react';
import {ArrowRight, Box, CheckCircle, Code, Github, Globe, Layers, Play, Shield, Terminal, Zap} from 'lucide-react';
import { Link } from 'react-router-dom';
import brandLogo from '../components/model_logos/App_assets/wordmark_D _white.svg';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-100px" }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative p-8 rounded-2xl bg-[#0E0E11] border border-white/10 hover:border-indigo-400/50 transition-colors group overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-white/40 italic leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description }: any) => (
  <div className="flex gap-6 relative">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white z-10 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
        {number}
      </div>
      <div className="w-0.5 h-full bg-gradient-to-b from-indigo-600 to-transparent mt-2 opacity-30" />
    </div>
    <div className="pb-12 pt-2">
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-lg leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 text-white font-sans overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center group -ml-2 md:-ml-4">
            <img src={brandLogo} alt="Coderat Logo" className="h-8 md:h-10 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left transition-opacity group-hover:opacity-90" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Log In</Link>
            <Link to="/login" className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-indigo-400 transition-colors uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>Coderat Engine 2.0 is now live</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-8 leading-none">
              STOP SHIPPING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 animate-gradient">
                BROKEN CODE.
              </span>
            </h1>
            
            <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Coderat discovers flows, generates Playwright tests, and runs them automatically on every PR. 
              Zero setup. Infinite peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row max-w-xl mx-auto bg-[#0E0E11] p-2 rounded-3xl sm:rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl relative z-20">
              <div className="flex-1 flex items-center pl-4 pr-4 sm:pr-0 py-3 sm:py-0 gap-3 text-white/40">
                <Globe className="h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="https://your-staging-app.com" 
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 font-mono text-sm"
                />
              </div>
              <Link to="/onboarding" className="w-full sm:w-auto px-6 py-4 sm:py-3 bg-white text-black hover:bg-white/90 text-xs rounded-2xl sm:rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group mt-2 sm:mt-0">
                Generate Magic Test
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/40">No credit card required. Free tier available.</p>
          </motion.div>

          {/* Abstract 3D-ish Interface Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 relative mx-auto max-w-5xl [perspective:2000px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-20" />
            <motion.div 
              className="rounded-2xl border border-white/10 bg-[#0E0E11] shadow-2xl overflow-hidden [transform:rotateX(15deg)] [transform-origin:top]"
              whileHover={{ rotateX: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="mx-auto px-12 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/40 flex items-center gap-2 font-bold uppercase tracking-widest">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  test-runner.coderat.ai
                </div>
              </div>
              <div className="p-8 text-left bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-tight">Checkout Flow Validated</h4>
                    <p className="text-white/40 text-sm italic">Pass time: 4.2s • Run #1042</p>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/60">
                    <span className="text-white/40">1</span> await page.goto('/checkout')
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/60">
                    <span className="text-white/40">2</span> await page.fill('[name="email"]', 'test@coderat.ai')
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 border-l-2 border-l-emerald-500 text-emerald-400">
                    <span className="text-white/40">3</span> await expect(page.locator('.success')).toBeVisible()
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-[#0E0E11]/30 border-y border-white/10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Built for Modern Teams</h2>
              <p className="text-xl text-white/40 italic max-w-2xl mx-auto">
                Everything you need to automate your QA process, without writing a single line of test code.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Box}
                title="AI DOM Discovery"
                description="Our engine scans your app's DOM tree, identifies core user pathways (Auth, Checkouts), and generates robust tests automatically."
                delay={0.1}
              />
              <FeatureCard 
                icon={Terminal}
                title="Self-Healing Tests"
                description="Buttons moved? IDs changed? Our AI understands context and auto-updates tests when your app's layout shifts, eliminating flaky tests."
                delay={0.2}
              />
              <FeatureCard 
                icon={Github}
                title="Native CI/CD Integration"
                description="Runs against Vercel/Netlify preview URLs automatically when a Pull Request is opened. Blocks merges if critical flows break."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-32 px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How Coderat Works</h2>
              <p className="text-xl text-slate-400 mb-12">
                We handle the heavy lifting of browser testing in an isolated worker environment.
              </p>
              
              <div className="space-y-2">
                <StepCard 
                  number="1" 
                  title="Connect Your App" 
                  description="Paste your staging URL or connect your GitHub repository. We will boot a secure worker to scan your application."
                />
                <StepCard 
                  number="2" 
                  title="AI Generates Test Suite" 
                  description="Our LLMs analyze the DOM and create step-by-step Playwright actions for your most critical business flows."
                />
                <StepCard 
                  number="3" 
                  title="Run on Pipeline" 
                  description="Every git push triggers a run. Get instant feedback on your PRs via GitHub Check Runs API."
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
              <div className="relative rounded-2xl bg-[#0E0E11] border border-white/10 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <Github className="h-8 w-8 text-white" />
                  <div>
                    <h4 className="text-white font-bold tracking-tight">coderat-bot <span className="text-white/40 font-normal italic">commented just now</span></h4>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                      <h5 className="font-bold text-emerald-400">All Core Flows Passed</h5>
                      <p className="text-sm text-white/40 mt-1 italic">Verified against Preview Deployment.</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white/60 font-mono text-[11px]">Login & Auth Flow</span>
                          <span className="text-white/40 font-mono text-[11px]">12s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white/60 font-mono text-[11px]">Stripe Checkout</span>
                          <span className="text-white/40 font-mono text-[11px]">18s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6 bg-[#050505] border-t border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-white/40 italic max-w-2xl mx-auto mb-20">
              Start for free, upgrade when you need to scale test runs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-3xl bg-[#0E0E11] border border-white/10 text-left">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Starter</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-white">$59</span>
                  <span className="text-white/40">/mo</span>
                </div>
                <p className="text-white/40 mb-8 pb-8 border-b border-white/10 italic text-sm">Perfect for indie hackers and small projects.</p>
                <ul className="space-y-4 mb-8 text-[13px]">
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> 250 Test Runs / month</li>
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> 2 Projects</li>
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> Basic AI Discovery</li>
                </ul>
                <button className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Start Trial</button>
              </div>

              <div className="p-8 rounded-3xl bg-[#0E0E11] border border-indigo-500/30 text-left relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-8 transform -translate-y-1/2 z-10">
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-400">Most Popular</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight relative z-10">Growth</h3>
                <div className="flex items-baseline gap-2 mb-6 relative z-10">
                  <span className="text-4xl font-bold text-white">$149</span>
                  <span className="text-indigo-400">/mo</span>
                </div>
                <p className="text-indigo-300/60 mb-8 pb-8 border-b border-indigo-500/20 italic text-sm relative z-10">For growing teams shipping daily.</p>
                <ul className="space-y-4 mb-8 text-[13px] relative z-10">
                  <li className="flex items-center gap-3 text-white"><CheckCircle className="h-5 w-5 text-indigo-400" /> 1,500 Test Runs / month</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle className="h-5 w-5 text-indigo-400" /> 10 Projects</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle className="h-5 w-5 text-indigo-400" /> Self-Healing Tests</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle className="h-5 w-5 text-indigo-400" /> GitHub CI/CD Integration</li>
                </ul>
                <button className="w-full py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-[11px] font-bold uppercase tracking-widest transition-colors relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.4)]">Go Growth</button>
              </div>

              <div className="p-8 rounded-3xl bg-[#0E0E11] border border-white/10 text-left">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Scale</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-white">$399</span>
                  <span className="text-white/40">/mo</span>
                </div>
                <p className="text-white/40 mb-8 pb-8 border-b border-white/10 italic text-sm">For enterprise-grade reliability.</p>
                <ul className="space-y-4 mb-8 text-[13px]">
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> Unlimited Test Runs</li>
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> Unlimited Projects</li>
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> Dedicated Worker Pool</li>
                  <li className="flex items-center gap-3 text-white/60"><CheckCircle className="h-5 w-5 text-indigo-500" /> Priority Slack Support</li>
                </ul>
                <button className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center group mb-6 -ml-2 md:-ml-4">
              <img src={brandLogo} alt="Coderat Logo" className="h-10 md:h-12 w-auto object-contain scale-[1.8] md:scale-[2.2] origin-left transition-opacity group-hover:opacity-90" />
            </div>
            <p className="text-white/40 italic max-w-sm text-sm">
              The AI-powered QA engineer for modern software teams. Discover, generate, and run tests automatically.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-tight mb-4 text-sm uppercase">Product</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-tight mb-4 text-sm uppercase">Legal</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
          <div className="flex gap-4">
            <span className="text-indigo-400">STATUS: LIVE</span>
            <span className="text-white/20">© 2026 CODERAT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
