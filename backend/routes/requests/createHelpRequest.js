import HelpRequest from "../../models/HelpRequest.js";

// Create a new help request 
const createHelpRequest = async (req, res) => {
  try {
    // Check if user is allowed to create requests
    if (req.user.role === 'can_help') {
      return res.status(403).json({ message: 'Your account type only allows offering help, not creating requests.' });
    }

    const { title, description, category, tags, urgency } = req.body;
    const newRequest = new HelpRequest({
      title, description, category, tags, urgency,
      requester: req.user.id
    });
    const request = await newRequest.save();
    const populated = await HelpRequest.findById(request._id)
      .populate('requester', ['name', 'trustScore']);
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default createHelpRequest;