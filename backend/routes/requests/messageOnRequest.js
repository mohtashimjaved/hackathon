import HelpRequest from "../../models/HelpRequest.js";

// Add message to a request
const messageOnRequest = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    let helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) return res.status(404).json({ message: 'Request not found' });

    helpRequest.messages.push({
      sender: req.user.id,
      text
    });

    await helpRequest.save();
    
    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('messages.sender', ['name']);
    
    res.json(populated.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default messageOnRequest;