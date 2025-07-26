import React from 'react';

const TransformSection = () => {
  const roles = [
    {
      number: '1',
      title: 'Designers',
      description: 'Officia et fugiat mollit qui. Dolor elit aliqua voluptate ipsum excepteur cillum consequat consectetur duis magna qui eu consequat occaecat. Deserunt nisl sit.'
    },
    {
      number: '2', 
      title: 'Developers',
      description: 'Pariatur consectetur laboris exercitation duis laboris. Commodo duis fugiat magna fugiat et ut anim elit. Tempor ante ex qui tempor tempor.'
    },
    {
      number: '3',
      title: 'Product owners',
      description: 'Ullamco consectetur ipsum eiusmod nisl adipisicing sint anim dolore ante excepteur. Voluptate ea ullamco sunt eu elit qui aliquip. Adipisicing.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <p className="text-blue-600 text-sm uppercase tracking-wide font-medium">
            GROW YOUR REVENUE
          </p>
        </div>
        
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
          Transform your business
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-12">
            {roles.map((role, index) => (
              <div key={index} className="flex space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {role.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl transform rotate-3 -z-10"></div>
              
              {/* Main image container */}
              <div className="relative bg-white p-4 ">
                <img 
                  src="./illustr-two.png"
                  alt="Business transformation illustration showing team collaboration and growth"
                  className="w-full h-90 object-cover rounded-xl"
                />
                
                {/* Optional floating decorative elements */}
                <div className="absolute top-6 right-6 w-4 h-4 bg-blue-500 rounded-full opacity-80"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformSection;