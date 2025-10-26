import React from 'react';

const FeatureSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Text Content */}
        <div className="flex-1">
          <p className="text-blue-600 text-sm font-semibold mb-2">Feature Highlights</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Showcase Your Work Effortlessly
          </h2>
          <p className="text-gray-600 mb-10 max-w-md">
            Discover how ShowWork makes <span className="text-blue-600 font-semibold">sharing your projects</span> easier than ever.
          </p>

          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">User-Friendly</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Drag-and-Drop Functionality</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Easily arrange and present your projects using our intuitive interface.
            </p>

            <ul className="space-y-6 max-w-sm">
              <li className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Generate tailored posts for every platform.</p>
                  <p className="text-gray-500 text-sm">Create content optimized for different social media channels with one click.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Showcase projects seamlessly on your portfolio.</p>
                  <p className="text-gray-500 text-sm">Display your work in a professional portfolio that highlights your skills.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Track your performance with smart analytics.</p>
                  <p className="text-gray-500 text-sm">Monitor engagement and growth with detailed insights and reports.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Image - Mobile App UI */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative max-w-xs">
            <div className="bg-black rounded-[40px] p-3 shadow-xl">
              <div className="relative overflow-hidden rounded-[28px] bg-white">
                <div className="absolute top-0 left-0 right-0 h-7 bg-black flex items-center justify-center">
                  <div className="w-20 h-5 bg-black rounded-b-lg"></div>
                </div>
                <div className="pt-7 pb-1">
                  <div className="flex items-center px-4 py-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span className="ml-2 text-sm font-medium">Canvas</span>
                  </div>
                  <div className="p-4 bg-gray-50 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="border border-gray-200 rounded-lg p-4 bg-white w-full mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium">When User Collection updates</div>
                          <div className="text-xs text-gray-500">Trigger when a user's status is updated</div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white w-full">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Check Eligibility</div>
                          <div className="text-xs text-gray-500">Verify eligibility criteria</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
