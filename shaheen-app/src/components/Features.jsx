import { Calendar } from "lucide-react";

const FeaturesSection = () => {
  // Feature data - can be easily modified or moved to props
  const features = [
    {
      title: "Smart Scheduling",
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    },
    {
      title: "Smart Scheduling", 
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    },
    {
      title: "Smart Scheduling",
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    },
    {
      title: "Smart Scheduling",
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    },
    {
      title: "Smart Scheduling",
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    },
    {
      title: "Smart Scheduling",
      description: "Lorem ipsum dolor sit amet consectetur. Urna ullamcorper scelerisque risus bibendum mauris lectus eleifend praesent venenatis."
    }
  ];

  return (
    <section className="bg-black text-white py-16 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Next-Gen <span className="text-purple-500">Features</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to create content that stands out
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-black border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-colors duration-300"
            >
              {/* Calendar Icon */}
              <div className="mb-6">
                <Calendar className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Feature Title */}
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
