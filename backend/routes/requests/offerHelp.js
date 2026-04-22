// Offer help on a request
const offerHelp = async (req, res) => {
  try {
    // Check if user is allowed to offer help
    if (req.user.role === 'need_help') {
      return res.status(403).json({ message: 'Your account type only allows creating requests, not offering help.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    let helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) return res.status(404).json({ message: 'Request not found' });

    if (helpRequest.status === 'solved') {
      return res.status(400).json({ message: 'This request is already solved' });
    }

    if (helpRequest.requester.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot offer help on your own request' });
    }

    // Check if already offered help (compare ObjectIds properly)
    const alreadyHelper = helpRequest.helpers.some(
      h => h.toString() === req.user.id
    );
    if (alreadyHelper) {
      return res.status(400).json({ message: 'You have already offered help on this request' });
    }

    helpRequest.helpers.push(req.user.id);
    if (helpRequest.status === 'open') {
      helpRequest.status = 'in-progress';
    }
    await helpRequest.save();

    // Return populated version so frontend gets helper names
    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('requester', ['name', 'skills', 'trustScore'])
      .populate('helpers', ['name', 'trustScore']);

    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default offerHelp;