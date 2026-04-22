import express from "express"
import tokenVerification from "../../config/tokenVerification.js";
import statsTrend from "./statsTrends.js";
import createHelpRequest from "./createHelpRequest.js";
import getOpenRequests from "./getOpenRequests.js";
import getUsersRequests from "./getUsersRequests.js";
import getSingleRequestDetail from "./getSingleRequestDetail.js";

const router = express.Router();

router.get('/stats/trends', tokenVerification, statsTrend);
router.post('/', tokenVerification, createHelpRequest);
router.get('/', getOpenRequests);
router.get('/me', tokenVerification, getUsersRequests);
router.get('/:id', getSingleRequestDetail)

export default router;