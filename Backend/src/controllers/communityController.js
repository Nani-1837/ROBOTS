import Community from '../models/Community.js';

export const joinCommunity = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already exists
    const existingMember = await Community.findOne({ email: email.toLowerCase() });
    
    if (existingMember) {
      return res.status(400).json({ message: 'You are already in the Hive!' });
    }

    const newMember = await Community.create({ email });
    
    res.status(201).json({ 
      message: 'Welcome to the Hive!',
      member: newMember
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
