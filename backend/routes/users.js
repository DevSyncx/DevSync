const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// DELETE /api/users/:id - Permanently delete user account
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    // Users can only delete their own account
    if (userId !== requestingUserId) {
      return res.status(403).json({ 
        message: 'You can only delete your own account' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perform hard delete - removes all user data (GDPR compliant)
    await User.findByIdAndDelete(userId);
    
    // TODO: Also delete related data (projects, tasks, etc.)
    // This should be implemented based on your data relationships

    res.status(200).json({ 
      message: 'Account permanently deleted',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting account', 
      error: error.message 
    });
  }
});

// PATCH /api/users/:id/deactivate - Deactivate user account
router.patch('/:id/deactivate', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    // Users can only deactivate their own account
    if (userId !== requestingUserId) {
      return res.status(403).json({ 
        message: 'You can only deactivate your own account' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is already deactivated' });
    }

    await user.deactivate();

    res.status(200).json({ 
      message: 'Account deactivated successfully',
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive,
        deactivatedAt: user.deactivatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deactivating account', 
      error: error.message 
    });
  }
});

// PATCH /api/users/:id/reactivate - Reactivate user account
router.patch('/:id/reactivate', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    // Users can only reactivate their own account
    if (userId !== requestingUserId) {
      return res.status(403).json({ 
        message: 'You can only reactivate your own account' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isActive) {
      return res.status(400).json({ message: 'Account is already active' });
    }

    await user.reactivate();

    res.status(200).json({ 
      message: 'Account reactivated successfully',
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error reactivating account', 
      error: error.message 
    });
  }
});

module.exports = router;