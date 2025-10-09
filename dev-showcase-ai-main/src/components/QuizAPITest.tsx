import React, { useState } from 'react';
import { Loader, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { getHybridQuestions } from '@/utils/webQuestionService';

const QuizAPITest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    questions: any[];
    error?: string;
    source?: string;
  } | null>(null);

  const testAPI = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      console.log('🧪 Testing QuizAPI.io integration...');
      
      // Test with React questions
      const questions = await getHybridQuestions('react', 3, []);
      
      setResults({
        success: true,
        questions: questions,
        source: 'API/Local'
      });
      
      console.log('✅ API test successful:', questions);
    } catch (error) {
      console.error('❌ API test failed:', error);
      setResults({
        success: false,
        questions: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QuizAPI.io Test</h2>
        <p className="text-gray-600">
          Test the dynamic question fetching system
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={testAPI}
          disabled={isLoading}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#1E40AF] text-white hover:bg-[#1D4ED8]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Testing API...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Test QuizAPI.io</span>
            </>
          )}
        </button>

        {results && (
          <div className={`p-4 rounded-lg border ${
            results.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {results.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                results.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.success ? 'Success!' : 'Failed'}
              </span>
            </div>

            {results.success ? (
              <div className="space-y-3">
                <p className="text-green-700">
                  ✅ Fetched {results.questions.length} questions from {results.source}
                </p>
                
                {results.questions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Sample Questions:</h4>
                    {results.questions.slice(0, 2).map((q, index) => (
                      <div key={index} className="bg-white p-3 rounded border text-sm">
                        <p className="font-medium text-gray-800 mb-1">
                          Q{index + 1}: {q.question}
                        </p>
                        <p className="text-gray-600">
                          Tech: {q.techStack} | Correct: {q.correctAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-700">
                <p className="mb-2">❌ Error: {results.error}</p>
                <p className="text-sm">
                  The system will automatically fall back to local questions.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">API Configuration</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Endpoint: https://quizapi.io/api/v1/questions</p>
            <p>• Format: ?apiKey=YOUR_API_KEY&limit=20</p>
            <p>• Fallback: Local questions if API fails</p>
            <p>• Cache: 1 hour duration</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Setup Instructions</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>1. Get API key from <a href="https://quizapi.io/" target="_blank" rel="noopener noreferrer" className="underline">quizapi.io</a></p>
            <p>2. Create .env file in project root</p>
            <p>3. Add: VITE_QUIZ_API_KEY=your_actual_key</p>
            <p>4. Restart development server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAPITest;







