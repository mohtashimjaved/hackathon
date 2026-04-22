import HelpRequest from "../../models/HelpRequest.js";

// Get personalized stats for trends 
const statsTrend = async (req, res) => {
  try {
    const days = 7;
    const trends = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Count only user's requests
      const requestCount = await HelpRequest.countDocuments({
        requester: req.user.id,
        createdAt: { $gte: date, $lt: nextDate }
      });

      // Count user's help contributions (where they are in the helpers list and activity happened)
      const helpCount = await HelpRequest.countDocuments({
        helpers: { $in: [req.user.id] },
        updatedAt: { $gte: date, $lt: nextDate }
      });

      trends.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: requestCount,
        helpGiven: helpCount
      });
    }
    
    res.json(trends);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default statsTrend;