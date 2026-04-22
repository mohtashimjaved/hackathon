import express from "express"
import authRoutes from "../routes/auth/index.js"

const router = express.Router()

app.use('/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

export default router;
