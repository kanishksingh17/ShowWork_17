import mongoose from "mongoose";

const ScheduledPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: false },
  platforms: [{ type: String, enum: ["linkedin", "twitter", "reddit", "facebook", "instagram"] }],
  payload: {
    text: String,
    mediaUrls: [String],
    perPlatform: mongoose.Schema.Types.Mixed,
  },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ["pending", "queued", "published", "failed", "partial"], default: "pending" },
  results: [{ platform: String, postId: String, url: String, status: String, error: String }],
}, { timestamps: true });

export default mongoose.models.ScheduledPost || mongoose.model("ScheduledPost", ScheduledPostSchema);
