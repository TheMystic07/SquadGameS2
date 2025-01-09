import Vote from "../models/voteModel.js";
import User from "../models/userModel.js";

export const calculateResults = async () => {
  try {
    // Get all votes and users
    const votes = await Vote.find();
    const allUsers = await User.find();


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

    // Get all users who voted for the winning shape
    const mostVotedShapeVoters = new Set(
      votes
        .filter(vote => vote.shape === mostVotedShape)
        .map(vote => vote.walletAddress.toString())
    );


    // Get list of all users who voted
    const allVoters = new Set(
      votes.map(vote => vote.walletAddress.toString())
    );

    // Calculate eliminated users (those who didn't vote for winning shape or didn't vote at all)
    const eliminated = allUsers
      .filter(user => mostVotedShapeVoters.has(user._id.toString()))
      .map(user => ({
        userId: user._id,
        username: user.username,
        status: allVoters.has(user._id.toString()) ? 'voted_wrong' : 'did_not_vote'
      }));

    console.log(allUsers)

    return { 
      voteCounts, 
      eliminated, 
      mostVotedShape,
      stats: {
        totalUsers: allUsers.length,
        totalVotes: votes.length,
        eliminatedCount: eliminated.length
      }
    };
    
  } catch (error) {
    console.error("Error calculating results:", error);
  }
};