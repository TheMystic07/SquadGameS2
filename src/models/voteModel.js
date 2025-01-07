import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  shape: { type: String, required: true, enum: ["circle", "square", "triangle", "hexagon"] },
});

export default mongoose.model("Vote", voteSchema);
