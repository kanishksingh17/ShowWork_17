import React, { useState, useEffect } from "react";
import {
  testAPIConnections,
  getAPIStatus,
  getHybridQuestions,
} from "../utils/webQuestionService";

const APITestComponent: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [sampleQuestions, setSampleQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get initial API status
    const status = getAPIStatus();
    setApiStatus(status);
    console.log("🔧 API Configuration:", status);
  }, []);

  const handleTestAPIs = async () => {
    setLoading(true);
    try {
      console.log("🚀 Testing API connections...");
      const results = await testAPIConnections();
      setTestResults(results);
    } catch (error) {
      console.error("❌ API test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSampleQuestions = async () => {
    setLoading(true);
    try {
      console.log("📚 Fetching sample questions...");
      const questions = await getHybridQuestions("javascript", 3, []);
      setSampleQuestions(questions);
      console.log("✅ Sample questions:", questions);
    } catch (error) {
      console.error("❌ Question fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        🌐 Improved Hybrid API System
      </h2>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          🔄 <strong>Fixed OpenTDB Issues:</strong> Added JService API as
          primary source + multiple fallbacks
        </p>
      </div>

      {/* API Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          📊 API Configuration Status
        </h3>
        {apiStatus && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Real APIs Enabled:</strong>{" "}
              {apiStatus.realAPIsEnabled ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Available APIs:</strong>{" "}
              {apiStatus.availableAPIs.join(", ") || "None"}
            </p>
            <p>
              <strong>OpenTDB:</strong>{" "}
              {apiStatus.config.ENABLE_OPENTDB ? "✅" : "❌"}
            </p>
            <p>
              <strong>QuizAPI:</strong>{" "}
              {apiStatus.config.ENABLE_QUIZ_API ? "✅" : "❌"}
            </p>
          </div>
        )}
      </div>

      {/* Test Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleTestAPIs}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "🔄 Testing..." : "🔍 Test API Connections"}
        </button>

        <button
          onClick={handleFetchSampleQuestions}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "🔄 Fetching..." : "📚 Fetch Sample Questions"}
        </button>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            🔗 API Connection Results
          </h3>
          <div className="space-y-1 text-sm">
            {Object.entries(testResults).map(([api, status]) => (
              <p key={api}>
                <strong>{api}:</strong> {status ? "✅ Connected" : "❌ Failed"}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Sample Questions */}
      {sampleQuestions.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            📝 Sample Questions (JavaScript)
          </h3>
          <div className="space-y-4">
            {sampleQuestions.map((question, index) => (
              <div key={question.id} className="p-3 bg-white rounded border">
                <p className="font-medium mb-2">
                  Q{index + 1}: {question.question}
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  {question.options.map((option: string, optIndex: number) => (
                    <li
                      key={optIndex}
                      className={
                        optIndex === question.correctAnswer
                          ? "text-green-600 font-medium"
                          : ""
                      }
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Source: {question.id.includes("web_") ? "Web API" : "Local"} |
                  Difficulty: {question.difficulty} | Category:{" "}
                  {question.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📖 Instructions</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>
            Click "Test API Connections" to verify external APIs are working
          </li>
          <li>Click "Fetch Sample Questions" to test the hybrid system</li>
          <li>Check browser console for detailed logs</li>
          <li>Questions will fallback to local bank if APIs fail</li>
        </ul>
      </div>
    </div>
  );
};

export default APITestComponent;
