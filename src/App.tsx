/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import AIProviders from './pages/AIProviders';
import PublicIntegrations from './pages/PublicIntegrations';
import Features from './pages/Features';
import Sandbox from './pages/Sandbox';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Security from './pages/Security';
import VSCode from './pages/VSCode';
import CLI from './pages/CLI';
import Community from './pages/Community';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (!user.user_metadata?.profile_completed && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/integrations" element={<PublicIntegrations />} />
          <Route path="/features" element={<Features />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/security" element={<Security />} />
          <Route path="/vscode" element={<VSCode />} />
          <Route path="/cli" element={<CLI />} />
          <Route path="/community" element={<Community />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
          <Route path="/models" element={<ProtectedRoute><AIProviders /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
