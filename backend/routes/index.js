import express from "express"
import authRoutes from "../routes/auth/index.js"
import requestsRoutes from "../routes/requests/index.js"

const router = express.Router()

router.use('/auth', authRoutes);
router.use('/requests', requestsRoutes);
// router.use('/api/users', userRoutes);

export default router;
