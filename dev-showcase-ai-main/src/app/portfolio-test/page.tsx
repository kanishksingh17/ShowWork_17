export default function PortfolioTestPage() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          ✅ Portfolio Route Working!
        </h1>
        <p className="text-xl text-green-700 mb-8">
          This confirms that the portfolio routing is working correctly.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>Portfolio Routing:</span>
              <span className="text-green-600 font-semibold">✅ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Next.js App Router:</span>
              <span className="text-green-600 font-semibold">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Page Rendering:</span>
              <span className="text-green-600 font-semibold">✅ Success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
