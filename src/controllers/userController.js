import User from "../models/userModel.js";

export async function searchUser(req, res) {
  const { walletAddress  } = req.query;

  try {
    let users;
    if (walletAddress) {
      // Search by walletAddress
      users = await User.find({ walletAddress: walletAddress });
    } else {
      return res.status(400).json({ error: "Invalid search parameters" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Error searching users" });
  }
}
