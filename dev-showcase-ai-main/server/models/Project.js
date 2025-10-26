import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["running", "ended", "pending"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: [String],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    budget: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0, // in minutes
    },
  },
  {
    timestamps: true,
  },
);

// Calculate progress percentage based on completed vs total tasks
projectSchema.virtual("progressPercentage").get(function () {
  if (this.totalTasks === 0) return 0;
  return Math.round((this.completedTasks / this.totalTasks) * 100);
});

// Static method to get dashboard statistics
projectSchema.statics.getDashboardStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Initialize default stats
  const dashboardStats = {
    totalProjects: 0,
    runningProjects: 0,
    endedProjects: 0,
    pendingProjects: 0,
  };

  // Update stats based on aggregation results
  stats.forEach((stat) => {
    switch (stat._id) {
      case "running":
        dashboardStats.runningProjects = stat.count;
        break;
      case "ended":
        dashboardStats.endedProjects = stat.count;
        break;
      case "pending":
        dashboardStats.pendingProjects = stat.count;
        break;
    }
  });

  dashboardStats.totalProjects =
    dashboardStats.runningProjects +
    dashboardStats.endedProjects +
    dashboardStats.pendingProjects;

  return dashboardStats;
};

const Project = mongoose.model("Project", projectSchema);

export default Project;
