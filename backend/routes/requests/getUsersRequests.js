import HelpRequest from "../../models/HelpRequest.js";

// Get user's requests (Dashboard) 
const getUsersRequests = async (req, res) => {
    try {
        const requested = await HelpRequest.find({ requester: req.user.id })
            .populate('helpers', ['name', 'trustScore'])
            .sort({ createdAt: -1 });
        const helping = await HelpRequest.find({ helpers: { $in: [req.user.id] } })
            .populate('requester', ['name'])
            .sort({ createdAt: -1 });
        res.json({ requested, helping });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export default getUsersRequests;