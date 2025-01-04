import { Router } from "express";
import { generateToken } from "../middlewares/auth.js";
import { searchUser } from "../controllers/userController.js";

const router = Router();

router.post("/login", (req, res) => {
  const { walletAddress } = req.body;

  console.log("walletAddress", walletAddress);

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

  const token = generateToken(walletAddress);
  res.status(200).json({ token });
});

router.get("/search", searchUser);

export default router;
