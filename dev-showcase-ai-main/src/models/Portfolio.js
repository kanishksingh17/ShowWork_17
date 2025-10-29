import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  userId: String,
  templateId: String,
  domain: String,
  healthScore: { type: Number, default: 50 },
  lastHealthRecomputeAt: Date,
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
