import { Schema, model } from "mongoose";

const userSchema = new Schema({
  walletAddress: { type: String, unique: true, required: true },
});

export default model("User", userSchema);
