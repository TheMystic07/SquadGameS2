import { Router } from "express";
import { castVote, getResults, getUserVote } from "../controllers/votingController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { validateVote } from "../middlewares/validateVote.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { validateWalletAddress } from "../middlewares/validateWalletAddress.js";

const router = Router();

router.get("/uservote", authenticateToken, getUserVote);
router.post("/vote", authenticateToken, rateLimiter, validateVote,validateWalletAddress, castVote);
router.get("/results", authenticateToken, getResults);

export default router;
