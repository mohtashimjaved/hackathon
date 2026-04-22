// Mark as solved
const markSolved = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid request ID' });
    }

    const { helperId } = req.body;
    let helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) return res.status(404).json({ msg: 'Request not found' });

    if (helpRequest.requester.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only the requester can mark this as solved' });
    }

    if (helpRequest.status === 'solved') {
      return res.status(400).json({ msg: 'Already marked as solved' });
    }

    helpRequest.status = 'solved';
    if (helperId && mongoose.Types.ObjectId.isValid(helperId)) {
      helpRequest.selectedHelper = helperId;
      // Increment trust score for the helper who solved it
      await User.findByIdAndUpdate(helperId, { $inc: { trustScore: 10 } });
    }
    await helpRequest.save();

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('requester', ['name', 'skills', 'trustScore'])
      .populate('helpers', ['name', 'trustScore'])
      .populate('selectedHelper', ['name', 'trustScore']);

    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};