import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model("Participant", participantSchema);
