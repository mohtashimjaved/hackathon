import express from "express"
import tokenVerification from "../../config/tokenVerification";
import accessVerification from "./accessVerification";
import register from "./register";
import login from "./login";

const router = express.Router()

router.get('/me', tokenVerification, accessVerification)
router.post('/register', register)
router.post('/login', login)

export default router;