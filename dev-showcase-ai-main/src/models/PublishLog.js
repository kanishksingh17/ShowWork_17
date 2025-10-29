import mongoose from "mongoose";

const PublishLogSchema = new mongoose.Schema({
  jobId: String,
  scheduledPostId: { type: mongoose.Schema.Types.ObjectId, ref: "ScheduledPost" },
  platform: String,
  status: { type: String, enum: ["queued", "success", "failed"] },
  response: mongoose.Schema.Types.Mixed,
  error: String,
}, { timestamps: true });

export default mongoose.models.PublishLog || mongoose.model("PublishLog", PublishLogSchema);
