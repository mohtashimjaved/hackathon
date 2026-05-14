import User from '../../models/User.js';

const updateProfile = async (req, res) => {
  try {
    const { name, avatar, bio, skills, interests, location } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (location) user.location = location;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        location: user.location,
        trustScore: user.trustScore
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateProfile;
