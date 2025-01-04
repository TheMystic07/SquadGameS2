import Vote from "../models/vote.js";

export const calculateResults = async () => {
  const votes = await Vote.find();

  // Count votes for each shape
  const voteCounts = votes.reduce((acc, vote) => {
    acc[vote.shape] = (acc[vote.shape] || 0) + 1;
    return acc;
  }, {});

  // Determine the shape with the most votes
  const maxVotes = Math.max(...Object.values(voteCounts));
  const mostVotedShape = Object.keys(voteCounts).find(
    (shape) => voteCounts[shape] === maxVotes
  );

  // Get all participants who voted for the most-voted shape
  const eliminated = votes
    .filter((vote) => vote.shape === mostVotedShape)
    .map((vote) => vote.userId);

  return { voteCounts, eliminated, mostVotedShape };
};
