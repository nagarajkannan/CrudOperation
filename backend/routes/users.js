const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth'); 
const { permit } = require('../middleware/roles'); 

const router = express.Router();


router.get('/', auth, permit('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne(); 
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});


module.exports = router;
