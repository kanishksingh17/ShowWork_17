import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of correct option
  explanation: { type: String },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  points: { type: Number, default: 1 },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "HTML", "CSS", "JavaScript"
  displayName: { type: String, required: true }, // e.g., "HTML5", "CSS3", "JavaScript (ES6+)"
  category: {
    type: String,
    required: true,
    enum: ["programming", "design", "soft-skills", "tools"],
  },
  description: { type: String },
  icon: { type: String }, // Icon class or URL
  color: { type: String, default: "#3B82F6" },

  // Quiz Configuration
  questions: [questionSchema],
  totalQuestions: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 600 }, // 10 minutes in seconds
  passingScore: { type: Number, default: 70 }, // Percentage

  // Difficulty Levels
  easyQuestions: { type: Number, default: 3 },
  mediumQuestions: { type: Number, default: 4 },
  hardQuestions: { type: Number, default: 3 },

  // Metadata
  isActive: { type: Boolean, default: true },
  version: { type: String, default: "1.0.0" },
  lastUpdated: { type: Date, default: Date.now },

  // Statistics
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
});

// Calculate total questions from difficulty breakdown
skillSchema.pre("save", function (next) {
  this.totalQuestions =
    this.easyQuestions + this.mediumQuestions + this.hardQuestions;
  next();
});

export default mongoose.model("Skill", skillSchema);
