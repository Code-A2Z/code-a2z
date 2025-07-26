// landing-page/page.jsx
import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustedBySection from './components/TrustedBySection';
import TransformSection from './components/TransformSection';
import FeaturesSection from './components/FeaturesSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TrustedBySection />
        <TransformSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default LandingPage;