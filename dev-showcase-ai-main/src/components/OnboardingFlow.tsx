import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowWorkLogo from "./ShowWorkLogo";

interface OnboardingData {
  profilePicture: string;
  name: string;
  role: string;
  bio: string;
  skills: Array<{ name: string; percentage: number }>;
}

interface OnboardingFlowProps {
  user: any;
  onComplete: (data: OnboardingData) => void;
}

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "Product Manager",
  "Content Creator",
  "Student",
];

const SKILL_QUESTIONS = {
  JavaScript: [
    {
      question: "What is the output of typeof null?",
      options: ["object", "null", "undefined", "string"],
      correct: 0,
    },
    {
      question: "Which method removes the last element from an array?",
      options: ["shift()", "pop()", "unshift()", "push()"],
      correct: 1,
    },
    {
      question: "What is closure in JavaScript?",
      options: [
        "A function that has access to variables in its outer scope",
        "A way to close browser tabs",
        "A method to end loops",
        "A type of variable",
      ],
      correct: 0,
    },
  ],
  React: [
    {
      question: "What hook is used for side effects?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1,
    },
    {
      question: "What is JSX?",
      options: [
        "A JavaScript library",
        "JavaScript XML",
        "A styling framework",
        "A testing tool",
      ],
      correct: 1,
    },
    {
      question: "How do you pass data to child components?",
      options: [
        "Through props",
        "Through state",
        "Through context",
        "Through refs",
      ],
      correct: 0,
    },
  ],
  Python: [
    {
      question: "What is the correct way to create a function?",
      options: [
        "function myFunc():",
        "def myFunc():",
        "create myFunc():",
        "func myFunc():",
      ],
      correct: 1,
    },
    {
      question: "Which data type is immutable?",
      options: ["List", "Dictionary", "Tuple", "Set"],
      correct: 2,
    },
    {
      question: "What does len() do?",
      options: [
        "Returns the length of an object",
        "Creates a new list",
        "Sorts a list",
        "Reverses a string",
      ],
      correct: 0,
    },
  ],
};

export default function OnboardingFlow({
  user,
  onComplete,
}: OnboardingFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    profilePicture: "",
    name: user?.name || "",
    role: "",
    bio: "",
    skills: [],
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number[]>>({});
  const [showLogo, setShowLogo] = useState(true);

  // Logo animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showLogo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-fade-in animate-glow mb-6">
            <ShowWorkLogo size="lg" variant="icon" />
          </div>
          <p className="text-gray-600 text-lg animate-pulse">
            Building your professional portfolio...
          </p>
        </div>
      </div>
    );
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateData("profilePicture", e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuizAnswer = (
    skill: string,
    questionIndex: number,
    answerIndex: number,
  ) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [skill]: {
        ...prev[skill],
        [questionIndex]: answerIndex,
      },
    }));
  };

  const calculateSkillScore = (skill: string) => {
    const answers = quizAnswers[skill] || {};
    const questions =
      SKILL_QUESTIONS[skill as keyof typeof SKILL_QUESTIONS] || [];
    let correct = 0;

    questions.forEach((_, index) => {
      if (answers[index] === questions[index].correct) {
        correct++;
      }
    });

    return Math.round((correct / questions.length) * 100);
  };

  const handleSkillQuizComplete = () => {
    const skills = Object.keys(SKILL_QUESTIONS).map((skill) => ({
      name: skill,
      percentage: calculateSkillScore(skill),
    }));
    updateData("skills", skills);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.profilePicture;
      case 1:
        return data.name && data.role && data.bio;
      case 2:
        return Object.keys(quizAnswers).length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 2) {
      handleSkillQuizComplete();
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {data.profilePicture ? (
                <img
                  src={data.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Upload Your Profile Picture
              </h3>
              <p className="text-gray-600 mb-4">
                Let employers see the real you
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-xl cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose Photo
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Tell Us About Yourself
              </h3>
              <p className="text-gray-600 mb-4">
                Help us personalize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Role
                </label>
                <select
                  value={data.role}
                  onChange={(e) => updateData("role", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select your role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={data.bio}
                  onChange={(e) => updateData("bio", e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us about yourself (max 150 characters)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {data.bio.length}/150
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Skill Assessment</h3>
              <p className="text-gray-600 mb-4">
                Let's measure your expertise in different technologies
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(SKILL_QUESTIONS).map(([skill, questions]) => (
                <div key={skill} className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-4">{skill}</h4>
                  <div className="space-y-4">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-2">
                        <p className="font-medium">{question.question}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option, oIndex) => (
                            <button
                              key={oIndex}
                              onClick={() =>
                                handleQuizAnswer(skill, qIndex, oIndex)
                              }
                              className={`p-3 text-left rounded-lg border transition-colors ${
                                quizAnswers[skill]?.[qIndex] === oIndex
                                  ? "border-teal-500 bg-teal-50 text-teal-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Portfolio is Ready! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Congratulations! You've completed your profile setup.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border max-w-md mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={data.profilePicture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold">{data.name}</h4>
                  <p className="text-sm text-gray-600">{data.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                {data.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-teal-600">
                        {skill.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleComplete}
                className="w-full px-8 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl"
              >
                View Dashboard
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `showwork.com/${user?.username}`,
                  )
                }
                className="w-full px-8 py-3 border border-teal-500 text-teal-500 rounded-xl font-medium hover:bg-teal-50 transition-colors"
              >
                Copy Portfolio Link
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <ShowWorkLogo size="lg" variant="full" className="flex-shrink-0" />
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                ← Back
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  canProceed()
                    ? "bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentStep === 2 ? "Complete Quiz" : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
