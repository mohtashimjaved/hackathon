import express from "express"
import tokenVerification from "../../config/tokenVerification.js";
import statsTrend from "./statsTrends.js";
import createHelpRequest from "./createHelpRequest.js";
import getOpenRequests from "./getOpenRequests.js";
import getUsersRequests from "./getUsersRequests.js";
import getSingleRequestDetail from "./getSingleRequestDetail.js";
import offerHelp from "./offerHelp.js";
import markSolved from "./markSolved.js";
import messageOnRequest from "./messageOnRequest.js";

const router = express.Router();

router.get('/stats/trends', tokenVerification, statsTrend);
router.post('/', tokenVerification, createHelpRequest);
router.get('/', getOpenRequests);
router.get('/me', tokenVerification, getUsersRequests);
router.get('/:id', getSingleRequestDetail);
router.post('/:id/offer-help', tokenVerification, offerHelp);
router.post('/:id/solve', tokenVerification, markSolved);
router.post('/:id/messages', tokenVerification, messageOnRequest);



export default router;