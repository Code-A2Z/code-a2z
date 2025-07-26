import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Your website,<br />
          beyond<br />
          expectations
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Make your website wonderful and build beyond your expectations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Get started
          </button>
          <span className="text-gray-500">or</span>
          <button className="text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
