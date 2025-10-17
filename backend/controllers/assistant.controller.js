const User = require('../models/User');

// Placeholder for future LLM integration
// You can replace this function with a call to OpenAI/Gemini, etc.
async function generateAssistantReply(prompt, context) {
  // Simple rules-based responses using available context until LLM is integrated
  const lines = [];
  if (context?.streak != null) {
    lines.push(`Your current streak is ${context.streak} day${context.streak === 1 ? '' : 's'}.`);
    if (context.streak >= 7) {
      lines.push('🔥 Great job keeping a 7+ day streak! Keep it going!');
    }
  }
  if (Array.isArray(context?.goals) && context.goals.length) {
    lines.push(`You have ${context.goals.length} active goal${context.goals.length === 1 ? '' : 's'}.`);
  }
  if (Array.isArray(context?.activity)) {
    const last7 = context.activity.slice(-7);
    lines.push(`Last 7 entries recorded: ${last7.length}.`);
  }
  if (context?.timeSpent) {
    lines.push(`Time spent: ${context.timeSpent}.`);
  }
  if (lines.length === 0) {
    lines.push('I can summarize your DevSync activity once you start logging!');
  }
  lines.push('\nTip: Ask me things like "What is my current streak?" or "Summarize my week."');
  return lines.join(' ');
}

exports.postAssistantMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ errors: [{ msg: 'Message is required' }] });
    }

    // Load user activity context
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    const context = {
      streak: user.streak,
      timeSpent: user.timeSpent,
      activity: user.activity,
      goals: user.goals,
      // Extend with commits/problemsSolved when available
    };

    const reply = await generateAssistantReply(message, context);

    return res.json({
      reply,
      insights: {
        streak: user.streak,
        timeSpent: user.timeSpent,
        goalsCount: Array.isArray(user.goals) ? user.goals.length : 0,
        recentActivityCount: Array.isArray(user.activity) ? user.activity.slice(-7).length : 0
      }
    });
  } catch (err) {
    console.error('Assistant error:', err.message);
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
};

// GET health/check + sample nudge
exports.getAssistantNudge = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    const msg = user.streak >= 1
      ? `🔥 You maintained a ${user.streak}-day streak, keep it going!`
      : 'Let’s kick off your first activity today!';
    res.json({ message: msg });
  } catch (err) {
    console.error('Assistant nudge error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
};


