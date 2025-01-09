import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  shape: { type: String, required: true, enum: ["umbrella", "star", "circle", "triangle"] },
  nftNumber: { type: String, required: true, unique: true },
});

export default mongoose.model("Vote", voteSchema);
