import User from "../models/userModel.js";

export const validateWalletAddress = async (req, res, next) => {
    const { walletAddress } = req.body;
  
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
  
    try {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      req.user = user; // Attach user object to the request
      next();
    } catch (error) {
      console.error("Error validating wallet address:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  