import Vote from "../models/voteModel.js";

export const validateVote = async (req, res, next) => {
  const { walletAddress } = req.user;
  console.log(walletAddress)
  console.log(req.user.walletAddress)

  // Check if the user has already voted
  const existingVote = await Vote.findOne({ walletAddress });
  if (existingVote) {
    return res.status(400).json({ error: "You have already voted." });
  }

  next();
};
