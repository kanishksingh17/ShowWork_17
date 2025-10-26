import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["meeting", "deadline", "task", "event"],
      default: "task",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient querying of upcoming reminders
reminderSchema.index({ owner: 1, dueDate: 1, isCompleted: 1 });

// Static method to get upcoming reminders for a user
reminderSchema.statics.getUpcomingReminders = async function (
  userId,
  limit = 10,
) {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next 7 days

  return this.find({
    owner: userId,
    isCompleted: false,
    dueDate: { $gte: now, $lte: upcoming },
  })
    .sort({ dueDate: 1 })
    .limit(limit)
    .populate("project", "name")
    .exec();
};

const Reminder = mongoose.model("Reminder", reminderSchema);

export default Reminder;
