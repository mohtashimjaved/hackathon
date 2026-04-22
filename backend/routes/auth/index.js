import express from "express"
import tokenVerification from "../../config/tokenVerification.js";
import accessVerification from "./accessVerification.js";
import register from "./register.js";
import login from "./login.js";

const router = express.Router()

router.get('/me', tokenVerification, accessVerification)
router.post('/register', register)
router.post('/login', login)

export default router;