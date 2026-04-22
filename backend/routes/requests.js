// import express from 'express';
// import HelpRequest from '../models/HelpRequest.js';
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// const router = express.Router();

// const authMiddleware = (req, res, next) => {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// // Get personalized stats for trends
// router.get('/stats/trends', authMiddleware, async (req, res) => {
//   try {
//     const days = 7;
//     const trends = [];
//     const now = new Date();
    
//     for (let i = days - 1; i >= 0; i--) {
//       const date = new Date(now);
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);
      
//       const nextDate = new Date(date);
//       nextDate.setDate(nextDate.getDate() + 1);

//       // Count only user's requests
//       const requestCount = await HelpRequest.countDocuments({
//         requester: req.user.id,
//         createdAt: { $gte: date, $lt: nextDate }
//       });

//       // Count user's help contributions (where they are in the helpers list and activity happened)
//       const helpCount = await HelpRequest.countDocuments({
//         helpers: { $in: [req.user.id] },
//         updatedAt: { $gte: date, $lt: nextDate }
//       });

//       trends.push({
//         name: date.toLocaleDateString('en-US', { weekday: 'short' }),
//         requests: requestCount,
//         helpGiven: helpCount
//       });
//     }
    
//     res.json(trends);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Create a new help request
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     // Check if user is allowed to create requests
//     if (req.user.role === 'can_help') {
//       return res.status(403).json({ msg: 'Your account type only allows offering help, not creating requests.' });
//     }

//     const { title, description, category, tags, urgency } = req.body;
//     const newRequest = new HelpRequest({
//       title, description, category, tags, urgency,
//       requester: req.user.id
//     });
//     const request = await newRequest.save();
//     const populated = await HelpRequest.findById(request._id)
//       .populate('requester', ['name', 'trustScore']);
//     res.json(populated);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Get all open/in-progress requests (Feed)
// router.get('/', async (req, res) => {
//   try {
//     const { category, urgency, tag, search } = req.query;
//     let query = { status: { $in: ['open', 'in-progress'] } };
    
//     if (category) query.category = category;
//     if (urgency) query.urgency = urgency;
//     if (tag) query.tags = { $in: [tag] };
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { tags: { $in: [new RegExp(search, 'i')] } }
//       ];
//     }

//     const requests = await HelpRequest.find(query)
//       .populate('requester', ['name', 'trustScore'])
//       .populate('helpers', ['name', 'trustScore'])
//       .sort({ createdAt: -1 });
//     res.json(requests);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Get user's requests (Dashboard)
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const requested = await HelpRequest.find({ requester: req.user.id })
//       .populate('helpers', ['name', 'trustScore'])
//       .sort({ createdAt: -1 });
//     const helping = await HelpRequest.find({ helpers: { $in: [req.user.id] } })
//       .populate('requester', ['name'])
//       .sort({ createdAt: -1 });
//     res.json({ requested, helping });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Get single request detail
// router.get('/:id', async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ msg: 'Invalid request ID' });
//     }
//     const request = await HelpRequest.findById(req.params.id)
//       .populate('requester', ['name', 'skills', 'trustScore'])
//       .populate('helpers', ['name', 'trustScore'])
//       .populate('selectedHelper', ['name', 'trustScore'])
//       .populate('messages.sender', ['name']);
//     if (!request) return res.status(404).json({ msg: 'Request not found' });
//     res.json(request);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Offer help on a request
// router.post('/:id/offer-help', authMiddleware, async (req, res) => {
//   try {
//     // Check if user is allowed to offer help
//     if (req.user.role === 'need_help') {
//       return res.status(403).json({ msg: 'Your account type only allows creating requests, not offering help.' });
//     }

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ msg: 'Invalid request ID' });
//     }

//     let helpRequest = await HelpRequest.findById(req.params.id);
//     if (!helpRequest) return res.status(404).json({ msg: 'Request not found' });

//     if (helpRequest.status === 'solved') {
//       return res.status(400).json({ msg: 'This request is already solved' });
//     }

//     if (helpRequest.requester.toString() === req.user.id) {
//       return res.status(400).json({ msg: 'You cannot offer help on your own request' });
//     }

//     // Check if already offered help (compare ObjectIds properly)
//     const alreadyHelper = helpRequest.helpers.some(
//       h => h.toString() === req.user.id
//     );
//     if (alreadyHelper) {
//       return res.status(400).json({ msg: 'You have already offered help on this request' });
//     }

//     helpRequest.helpers.push(req.user.id);
//     if (helpRequest.status === 'open') {
//       helpRequest.status = 'in-progress';
//     }
//     await helpRequest.save();

//     // Return populated version so frontend gets helper names
//     const populated = await HelpRequest.findById(helpRequest._id)
//       .populate('requester', ['name', 'skills', 'trustScore'])
//       .populate('helpers', ['name', 'trustScore']);

//     res.json(populated);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Mark as solved
// router.post('/:id/solve', authMiddleware, async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ msg: 'Invalid request ID' });
//     }

//     const { helperId } = req.body;
//     let helpRequest = await HelpRequest.findById(req.params.id);
//     if (!helpRequest) return res.status(404).json({ msg: 'Request not found' });

//     if (helpRequest.requester.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'Only the requester can mark this as solved' });
//     }

//     if (helpRequest.status === 'solved') {
//       return res.status(400).json({ msg: 'Already marked as solved' });
//     }

//     helpRequest.status = 'solved';
//     if (helperId && mongoose.Types.ObjectId.isValid(helperId)) {
//       helpRequest.selectedHelper = helperId;
//       // Increment trust score for the helper who solved it
//       await User.findByIdAndUpdate(helperId, { $inc: { trustScore: 10 } });
//     }
//     await helpRequest.save();

//     const populated = await HelpRequest.findById(helpRequest._id)
//       .populate('requester', ['name', 'skills', 'trustScore'])
//       .populate('helpers', ['name', 'trustScore'])
//       .populate('selectedHelper', ['name', 'trustScore']);

//     res.json(populated);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Add message to a request
// router.post('/:id/messages', authMiddleware, async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) return res.status(400).json({ msg: 'Message text is required' });

//     let helpRequest = await HelpRequest.findById(req.params.id);
//     if (!helpRequest) return res.status(404).json({ msg: 'Request not found' });

//     helpRequest.messages.push({
//       sender: req.user.id,
//       text
//     });

//     await helpRequest.save();
    
//     const populated = await HelpRequest.findById(helpRequest._id)
//       .populate('messages.sender', ['name']);
    
//     res.json(populated.messages);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// export default router;
