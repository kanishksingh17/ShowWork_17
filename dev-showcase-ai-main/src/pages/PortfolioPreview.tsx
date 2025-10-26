import React from "react";

export default function PortfolioPreview() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Portfolio Preview
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">Portfolio preview coming soon...</p>
        </div>
      </div>
    </div>
  );
}
