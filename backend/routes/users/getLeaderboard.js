import User from "../../models/User.js";

// Get Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ trustScore: -1 })
      .limit(10)
      .select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export default getLeaderboard;
