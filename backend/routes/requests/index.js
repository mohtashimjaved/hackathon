import express from "express"
import tokenVerification from "../../config/tokenVerification.js";
import statsTrend from "./statsTrends.js";
import createHelpRequest from "./createHelpRequest.js";

const router = express.Router()

router.get('/stats/trends', tokenVerification, statsTrend)
router.post('/', tokenVerification, createHelpRequest)

export default router;