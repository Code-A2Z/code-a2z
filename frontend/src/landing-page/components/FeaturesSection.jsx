import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '✓',
      title: 'Increase sales',
      description: 'Consectetur pariatur irure exercitation sit amet id consectetur consectetur magna et Lorem labore qui velit.'
    },
    {
      icon: '✓',
      title: 'Enterprise-ready',
      description: 'Labore duis pariatur est exercitation laboris cupidatat amet cillum. Amet nisl ullamco.'
    },
    {
      icon: '✓',
      title: 'Unlimited growth',
      description: 'Elit deserunt nisl esse duis cupidatat proident sit minim mollit officia pariatur incididunt in tempor.'
    },
    {
      icon: '✓',
      title: 'Recommended by experts',
      description: 'Velit sit tempor pariatur quis pariatur incididunt culpa dolor voluptate officia incididunt velit dolore.'
    },
    {
      icon: '✓',
      title: 'Modern platform',
      description: 'Laboris elit consectetur sint nisl eu mollit proident sit magna velit adipisicing consequat amet reprehenderit.'
    },
    {
      icon: '✓',
      title: 'Integrations',
      description: 'Nostrud excepteur incididunt proident sit nulla ipsum sunt nostrud est esse adipisicing irure officia consectetur.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <p className="text-blue-600 text-sm uppercase tracking-wide font-medium">
            FEATURES
          </p>
        </div>
        
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
          How we change the game
        </h2>

        {/* Grid with borders */}
        <div className="grid lg:grid-cols-3 bg-white">
          {features.map((feature, index) => (
            <div key={index} className={`p-8 lg:p-12 ${
              // Right border for all except last column
              (index % 3 !== 2) ? 'border-r border-gray-200' : ''
            } ${
              // Bottom border only for first row (indices 0, 1, 2)
              index < 3 ? 'border-b border-gray-200' : ''
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;