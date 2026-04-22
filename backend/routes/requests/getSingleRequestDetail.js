import mongoose from "mongoose";
import HelpRequest from "../../models/HelpRequest.js";

// Get single request detail
const getSingleRequestDetail = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }
    const request = await HelpRequest.findById(req.params.id)
      .populate('requester', ['name', 'skills', 'trustScore'])
      .populate('helpers', ['name', 'trustScore'])
      .populate('selectedHelper', ['name', 'trustScore'])
      .populate('messages.sender', ['name']);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default getSingleRequestDetail;