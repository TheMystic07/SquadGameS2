import Vote from "../models/vote.js";

export const validateVote = async (req, res, next) => {
  const { userId } = req.user;

  // Check if the user has already voted
  const existingVote = await Vote.findOne({ userId });
  if (existingVote) {
    return res.status(400).json({ error: "You have already voted." });
  }

  next();
};
