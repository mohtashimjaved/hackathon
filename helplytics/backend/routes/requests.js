import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Create a new help request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, tags, urgency } = req.body;
    const newRequest = new HelpRequest({
      title, description, category, tags, urgency,
      requester: req.user.id
    });
    const request = await newRequest.save();
    res.json(request);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all open requests (Feed)
router.get('/', async (req, res) => {
  try {
    const { category, urgency, tag } = req.query;
    let query = { status: 'open' };
    
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (tag) query.tags = { $in: [tag] };

    const requests = await HelpRequest.find(query)
      .populate('requester', ['name', 'trustScore'])
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get user's requests (Dashboard)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const requested = await HelpRequest.find({ requester: req.user.id }).populate('helpers', ['name']);
    const helping = await HelpRequest.find({ helpers: { $in: [req.user.id] } }).populate('requester', ['name']);
    res.json({ requested, helping });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get single request detail
router.get('/:id', async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id)
      .populate('requester', ['name', 'skills', 'trustScore'])
      .populate('helpers', ['name', 'trustScore']);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Offer help
router.post('/:id/offer-help', authMiddleware, async (req, res) => {
  try {
    let request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.requester.toString() === req.user.id) return res.status(400).json({ msg: 'Cannot help your own request' });
    if (request.helpers.includes(req.user.id)) return res.status(400).json({ msg: 'Already offered help' });

    request.helpers.push(req.user.id);
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Mark as solved
router.post('/:id/solve', authMiddleware, async (req, res) => {
  try {
    const { helperId } = req.body;
    let request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.requester.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    request.status = 'solved';
    if (helperId) {
      request.selectedHelper = helperId;
      // Increment trust score for helper (Bonus Feature)
      await User.findByIdAndUpdate(helperId, { $inc: { trustScore: 10 } });
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
