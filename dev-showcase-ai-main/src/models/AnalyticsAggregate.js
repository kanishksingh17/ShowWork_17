import mongoose from "mongoose";

const AnalyticsAggregateSchema = new mongoose.Schema({
  portfolioId: String,
  day: String,
  counters: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  }
}, { timestamps: true });

AnalyticsAggregateSchema.index({ portfolioId: 1, day: 1 }, { unique: true });

export default mongoose.models.AnalyticsAggregate || mongoose.model("AnalyticsAggregate", AnalyticsAggregateSchema);
