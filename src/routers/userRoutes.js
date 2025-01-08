import { Router } from "express";
import { generateToken } from "../middlewares/auth.js";
import { searchUser } from "../controllers/userController.js";
import { validateWalletAddress } from "../middlewares/validateWalletAddress.js"; 
import User from "../models/userModel.js";

const router = Router();

// Login route
router.post("/login", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

  try {
    let user = await User.findOne({ walletAddress });

    if (!user) {
      // Automatically create the user
      user = new User({ walletAddress });
      await user.save();
    }

    // Generate token
    const token = generateToken(walletAddress);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Search user route
router.get("/search", validateWalletAddress, searchUser);

export default router;



