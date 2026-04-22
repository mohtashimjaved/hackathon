import express from "express"
import tokenVerification from "../../config/tokenVerification.js";
import statsTrend from "./statsTrends.js";
import createHelpRequest from "./createHelpRequest.js";
import getOpenRequests from "./getOpenRequests.js";

const router = express.Router()

router.get('/stats/trends', tokenVerification, statsTrend)
router.post('/', tokenVerification, createHelpRequest)
router.get('/', getOpenRequests)

export default router;