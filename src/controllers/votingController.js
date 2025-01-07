import Vote from "../models/voteModel.js";
import { calculateResults } from "../services/votingService.js";

export const castVote = async (req, res) => {
  const { walletAddress } = req.user;
  const { shape } = req.body;

  try {
    const existingVote = await Vote.findOne({ walletAddress });
    if (existingVote) {
      return res.status(400).json({ error: "User has already voted." });
    }

    const vote = new Vote({ walletAddress, shape });
    await vote.save();
    res.status(200).json({ message: "Vote cast successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while casting your vote." });
  }
};

export const getUserVote = async (req, res) => {
  const { walletAddress } = req.body;

  try {
    const vote = await Vote.findOne({ walletAddress });
    res.status(200).json(vote);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching user vote." });
  }
};

export const getResults = async (_req, res) => {
  try {
    const results = await calculateResults();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching results." });
  }
};
