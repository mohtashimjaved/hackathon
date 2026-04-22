import express from "express"
import authRoutes from "../routes/auth/index.js"
import requestsRoutes from "../routes/requests/index.js"
import usersRoutes from "../routes/users/index.js"

const router = express.Router()

router.use('/auth', authRoutes);
router.use('/requests', requestsRoutes);
router.use('/users', usersRoutes);

export default router;
