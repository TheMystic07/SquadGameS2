import Vote from "../models/voteModel.js";
import { calculateResults } from "../services/votingService.js";

export const castVote = async (req, res) => {
  const { userId } = req.user;
  const { shape } = req.body;

  try {
    const vote = new Vote({ userId, shape });
    await vote.save();
    res.status(200).json({ message: "Vote cast successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while casting your vote." });
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
