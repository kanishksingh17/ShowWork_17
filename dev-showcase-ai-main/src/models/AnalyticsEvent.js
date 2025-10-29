import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema({
  userId: String,
  portfolioId: String,
  projectId: String,
  eventType: { type: String, enum: ["view", "download", "share", "like", "click"] },
  platform: { type: String, default: "site" },
  meta: mongoose.Schema.Types.Mixed,
  ts: { type: Date, default: Date.now }
}, { timestamps: true });

AnalyticsEventSchema.index({ portfolioId: 1, eventType: 1, ts: 1 });

export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);