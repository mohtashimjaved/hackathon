import express from "express";
import tokenVerification from "../../config/tokenVerification.js";
import getLeaderboard from "./getLeaderboard.js";
import getUserProfile from "./getUserProfile.js";

const router = express.Router();
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserProfile);

export default router;