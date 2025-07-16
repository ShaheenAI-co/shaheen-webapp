import React from "react";

const FeaturesCard = ({ icon, title, description }) => {
  return (
    <div className="bg-black border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-colors duration-300">
      <div className="mb-6">{icon}</div>

      <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>

      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeaturesCard;
