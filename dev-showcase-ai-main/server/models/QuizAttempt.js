import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  userAnswer: { type: Number, required: true }, // Index of selected option
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpent: { type: Number, default: 0 }, // Time spent on this question in seconds
  points: { type: Number, default: 0 },
});

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  skillName: { type: String, required: true }, // For quick access

  // Quiz Results
  score: { type: Number, required: true, min: 0, max: 100 },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },

  // Detailed Results
  answers: [answerSchema],

  // Timing
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalTime: { type: Number, required: true }, // Total time in seconds

  // Status
  status: {
    type: String,
    enum: ["in-progress", "completed", "abandoned"],
    default: "in-progress",
  },
  passed: { type: Boolean, required: true },

  // Metadata
  attemptNumber: { type: Number, default: 1 }, // Which attempt for this user+skill
  ipAddress: { type: String },
  userAgent: { type: String },

  createdAt: { type: Date, default: Date.now },
});

// Calculate derived fields
quizAttemptSchema.pre("save", function (next) {
  if (this.answers && this.answers.length > 0) {
    this.correctAnswers = this.answers.filter((a) => a.isCorrect).length;
    this.incorrectAnswers = this.answers.filter((a) => !a.isCorrect).length;
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    this.passed = this.score >= 70; // Assuming 70% is passing
  }

  if (this.startTime && this.endTime) {
    this.totalTime = Math.round((this.endTime - this.startTime) / 1000);
  }

  next();
});

// Index for performance
quizAttemptSchema.index({ userId: 1, skillId: 1, createdAt: -1 });
quizAttemptSchema.index({ skillId: 1, score: -1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
