const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// @route   POST api/feedback
// @desc    Submit user feedback
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment, category, isAnonymous } = req.body;
    
    // Validate the data
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }
    
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide feedback with at least 10 characters' });
    }
    
    // Create a new feedback instance
    const newFeedback = new Feedback({
      userId: req.user.id,
      rating,
      comment,
      category: category || 'other',
      isAnonymous: isAnonymous || false
    });
    
    // Save the feedback to the database
    await newFeedback.save();
    
    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting feedback:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/feedback/guest
// @desc    Submit guest (unauthenticated) feedback
// @access  Public
router.post('/guest', async (req, res) => {
  try {
    const { rating, comment, category, isAnonymous = true } = req.body;
    
    // Validate the data
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }
    
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide feedback with at least 10 characters' });
    }
    
    // Create a new feedback instance for guest user
    const newFeedback = new Feedback({
      userId: "guest",
      rating,
      comment,
      category: category || 'other',
      isAnonymous: true // Always anonymous for guests
    });
    
    // Save the feedback to the database
    await newFeedback.save();
    
    res.json({ success: true, message: 'Guest feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting guest feedback:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/feedback
// @desc    Get all feedback (for admin/community page)
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log("Feedback GET request received");
    
    // Get feedback sorted by date (newest first)
    try {
      const feedbackList = await Feedback.find()
        .sort({ date: -1 })
        .select(
          // Don't include user ID if feedback is anonymous
          '-__v ' + (req.query.includePrivate === 'true' ? '' : '-userId')
        );
      
      // Process feedback for public display
      const processedFeedback = feedbackList.map(feedback => {
        const feedbackObj = feedback.toObject();
        
        // If feedback is anonymous, remove any identifiable information
        if (feedbackObj.isAnonymous && !req.query.includePrivate) {
          feedbackObj.userId = 'anonymous';
        }
        
        return feedbackObj;
      });
      
      return res.json(processedFeedback);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // If database operation fails, return empty array
      return res.json([]);
    }
  } catch (err) {
    console.error('Error getting feedback:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;