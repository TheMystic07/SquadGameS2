import { Schema, model } from "mongoose";

const userSchema = new Schema({
  walletAddress: { type: String, unique: true, required: true },
  nftNumber: { type: String, unique: true, required: false },
  username: { type: String, required: true },
});

export default model("User", userSchema);
