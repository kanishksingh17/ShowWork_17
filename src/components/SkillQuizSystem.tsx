import React, { useState, useEffect } from 'react';
import { getHybridQuestions } from '../utils/webQuestionService';
import { Question } from '../utils/questionBank';
import { ChevronLeft, ChevronRight, CheckCircle, X, RotateCcw, Target, Award, TrendingUp } from 'lucide-react';

// Tech stack options for selection
const TECH_STACKS = [
  { id: 'react', name: 'React', icon: '⚛️', color: 'bg-blue-500' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢', color: 'bg-green-500' },
  { id: 'expressjs', name: 'Express.js', icon: '🚀', color: 'bg-gray-600' },
  { id: 'python', name: 'Python', icon: '🐍', color: 'bg-yellow-500' },
  { id: 'javascript', name: 'JavaScript', icon: '📄', color: 'bg-yellow-400' },
  { id: 'typescript', name: 'TypeScript', icon: '📘', color: 'bg-blue-600' },
  { id: 'html', name: 'HTML', icon: '🌐', color: 'bg-orange-500' },
  { id: 'java', name: 'Java', icon: '☕', color: 'bg-orange-600' },
  { id: 'sql', name: 'SQL', icon: '🗃️', color: 'bg-purple-500' },
  { id: 'php', name: 'PHP', icon: '🐘', color: 'bg-purple-600' },
  { id: 'vue', name: 'Vue.js', icon: '💚', color: 'bg-emerald-500' },
  { id: 'angular', name: 'Angular', icon: '🅰️', color: 'bg-red-500' },
  { id: 'go', name: 'Go', icon: '🐹', color: 'bg-cyan-500' },
  { id: 'rust', name: 'Rust', icon: '🦀', color: 'bg-orange-700' }
];

interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  question: Question;
}

interface QuizState {
  phase: 'selection' | 'quiz' | 'completion';
  selectedStacks: string[];
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
  showAnswer: boolean;
  isLoading: boolean;
}

const SkillQuizSystem: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    phase: 'selection',
    selectedStacks: [],
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    showAnswer: false,
    isLoading: false
  });

  // Stack Selection Phase
  const toggleStack = (stackId: string) => {
    setQuizState(prev => ({
      ...prev,
      selectedStacks: prev.selectedStacks.includes(stackId)
        ? prev.selectedStacks.filter(id => id !== stackId)
        : [...prev.selectedStacks, stackId]
    }));
  };

  // Fetch Questions for Selected Stacks
  const startQuiz = async () => {
    if (quizState.selectedStacks.length === 0) return;

    setQuizState(prev => ({ ...prev, isLoading: true }));

    try {
      const allQuestions: Question[] = [];
      
      // Fetch 10 questions per stack as specified
      for (const stack of quizState.selectedStacks) {
        console.log(`🎯 Fetching questions for ${stack}...`);
        const stackQuestions = await getHybridQuestions(stack, 10, []);
        allQuestions.push(...stackQuestions);
      }

      // Randomize question order
      const shuffledQuestions = shuffleArray(allQuestions);
      
      console.log(`📚 Total questions fetched: ${shuffledQuestions.length}`);

      setQuizState(prev => ({
        ...prev,
        questions: shuffledQuestions,
        phase: 'quiz',
        isLoading: false,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        showAnswer: false
      }));
    } catch (error) {
      console.error('❌ Failed to fetch questions:', error);
      setQuizState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Auto-continue after showing answer
  useEffect(() => {
    if (quizState.showAnswer && quizState.phase === 'quiz') {
      console.log('⏰ Starting 2-second auto-continue timer');
      
      const timer = setTimeout(() => {
        console.log('🚀 Auto-continue: Moving to next question');
        
        setQuizState(prev => {
          const nextIndex = prev.currentQuestionIndex + 1;
          
          if (nextIndex >= prev.questions.length) {
            console.log('🏁 Quiz completed - moving to completion phase');
            return { ...prev, phase: 'completion' };
          } else {
            console.log(`📝 Moving to question ${nextIndex + 1}`);
            return {
              ...prev,
              currentQuestionIndex: nextIndex,
              showAnswer: false
            };
          }
        });
      }, 2000); // Auto-continue after 2 seconds

      return () => {
        console.log('🧹 Cleaning up auto-continue timer');
        clearTimeout(timer);
      };
    }
  }, [quizState.showAnswer, quizState.phase]);

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log('🔍 Quiz State Changed:', {
      phase: quizState.phase,
      showAnswer: quizState.showAnswer,
      currentQuestion: quizState.currentQuestionIndex + 1,
      totalQuestions: quizState.questions.length
    });
  }, [quizState.showAnswer, quizState.phase, quizState.currentQuestionIndex]);

  // Answer Selection
  const selectAnswer = (answerIndex: number) => {
    if (quizState.showAnswer) {
      console.log('⚠️ Answer already selected - ignoring click');
      return;
    }

    console.log(`🎯 Answer selected: Option ${String.fromCharCode(65 + answerIndex)} (index: ${answerIndex})`);
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    console.log(`✅ Answer is ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
    
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      question: currentQuestion
    };

    console.log('🔄 Setting showAnswer to true - this should trigger useEffect');
    
    setQuizState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      score: prev.score + (isCorrect ? 1 : 0),
      showAnswer: true
    }));
  };

  // Next Question
  const nextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= quizState.questions.length) {
      // Quiz completed
      setQuizState(prev => ({ ...prev, phase: 'completion' }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        showAnswer: false
      }));
    }
  };

  // Restart Quiz
  const restartQuiz = (sameStack: boolean = false) => {
    if (sameStack && quizState.selectedStacks.length > 0) {
      startQuiz();
    } else {
      setQuizState({
        phase: 'selection',
        selectedStacks: [],
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        showAnswer: false,
        isLoading: false
      });
    }
  };

  // Get current question
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
  const percentage = Math.round((quizState.score / quizState.questions.length) * 100);

  // Stack Selection Screen
  if (quizState.phase === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 Skill-Based Quiz System</h1>
            <p className="text-lg text-gray-600">Select your tech stack(s) to start the quiz</p>
            <p className="text-sm text-gray-500 mt-2">Powered by QuizAPI.io • 10 questions per stack</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {TECH_STACKS.map(stack => (
              <button
                key={stack.id}
                onClick={() => toggleStack(stack.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  quizState.selectedStacks.includes(stack.id)
                    ? `${stack.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">{stack.icon}</div>
                <div className="font-semibold text-sm">{stack.name}</div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Selected: {quizState.selectedStacks.length} stack(s) • 
              Total questions: {quizState.selectedStacks.length * 10}
            </p>
            <button
              onClick={startQuiz}
              disabled={quizState.selectedStacks.length === 0 || quizState.isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
            >
              {quizState.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fetching Questions...
                </div>
              ) : (
                'Start Quiz 🚀'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (quizState.phase === 'quiz' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Score: {quizState.score}/{quizState.answers.length}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-6">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                TECH_STACKS.find(s => s.id === currentQuestion.techStack)?.color || 'bg-gray-500'
              } text-white`}>
                {currentQuestion.techStack.toUpperCase()}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {currentQuestion.difficulty}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = quizState.showAnswer && quizState.answers[quizState.answers.length - 1]?.selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const isIncorrect = quizState.showAnswer && isSelected && !isCorrect;
                
                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={quizState.showAnswer}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                      quizState.showAnswer
                        ? isCorrect
                          ? 'bg-green-50 border-green-500 text-green-800'
                          : isIncorrect
                          ? 'bg-red-50 border-red-500 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        quizState.showAnswer
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : isIncorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {quizState.showAnswer && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {quizState.showAnswer && isIncorrect && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-continue indicator */}
          {quizState.showAnswer && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-lg text-gray-700 font-medium">
                  {quizState.currentQuestionIndex + 1 >= quizState.questions.length 
                    ? '🎉 Showing results in 2 seconds...' 
                    : '⏭️ Next question in 2 seconds...'}
                </span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="mt-2">
                <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Completion Screen
  if (quizState.phase === 'completion') {
    const wrongAnswers = quizState.answers.filter(answer => !answer.isCorrect);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h1>
            <p className="text-lg text-gray-600">Here are your results</p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-800">{quizState.score}</h3>
              <p className="text-blue-600 font-medium">Correct Answers</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-800">{percentage}%</h3>
              <p className="text-green-600 font-medium">Success Rate</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-purple-800">{quizState.questions.length}</h3>
              <p className="text-purple-600 font-medium">Total Questions</p>
            </div>
          </div>

          {/* Wrong Answers Section */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Review Incorrect Answers</h2>
              <div className="space-y-4">
                {wrongAnswers.map((answer, index) => (
                  <div key={answer.questionId} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{answer.question.question}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Your Answer:</p>
                            <p className="text-sm bg-red-100 p-2 rounded">
                              {String.fromCharCode(65 + answer.selectedAnswer)}. {answer.question.options[answer.selectedAnswer]}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Correct Answer:</p>
                            <p className="text-sm bg-green-100 p-2 rounded">
                              {String.fromCharCode(65 + answer.correctAnswer)}. {answer.question.options[answer.correctAnswer]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => restartQuiz(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg flex items-center gap-2 justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again (Same Stack)
            </button>
            <button
              onClick={() => restartQuiz(false)}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg flex items-center gap-2 justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
              Choose New Stack
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkillQuizSystem;