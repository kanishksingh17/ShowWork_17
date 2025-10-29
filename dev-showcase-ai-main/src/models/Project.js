import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  tags: [String],
  links: { github: String, live: String },
  media: [String],
  inferredDomain: String,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
