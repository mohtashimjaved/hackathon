// Get all open/in-progress requests (Feed)
router.get('/', async (req, res) => {
  try {
    const { category, urgency, tag, search } = req.query;
    let query = { status: { $in: ['open', 'in-progress'] } };
    
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const requests = await HelpRequest.find(query)
      .populate('requester', ['name', 'trustScore'])
      .populate('helpers', ['name', 'trustScore'])
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});