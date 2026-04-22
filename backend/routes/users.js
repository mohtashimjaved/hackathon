// import express from 'express';
// import User from '../models/User.js';

// const router = express.Router();

// // Get Leaderboard
// router.get('/leaderboard', async (req, res) => {
//   try {
//     const users = await User.find()
//       .sort({ trustScore: -1 })
//       .limit(10)
//       .select('-password');
//     res.json(users);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// // Get user profile
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ msg: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// export default router;
