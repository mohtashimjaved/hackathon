import express from "express";
import tokenVerification from "../../config/tokenVerification.js";
import getLeaderboard from "./getLeaderboard.js";
import getUserProfile from "./getUserProfile.js";
import updateProfile from "./updateProfile.js";

const router = express.Router();
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserProfile);
router.put('/me', tokenVerification, updateProfile);

export default router;