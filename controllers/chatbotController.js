/**
 * This is a simplified, rule-based chatbot controller.
 * For a production application, you would replace this logic
 * with API calls to a proper NLP service like Google's Gemini API
 * to understand and respond to a wider range of user inputs naturally.
 */

/**
 * @desc    Handle incoming chat messages
 * @route   POST /api/chatbot/chat
 * @access  Private
 */
exports.handleChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    const lowerCaseMessage = message.toLowerCase();

    // Default response
    let response = {
        text: "I'm here to offer some initial support. Remember, for more in-depth help, our counselors are available. How are you feeling today?",
        referral: null
    };

    // --- Crisis Detection ---
    // Keywords to identify users in immediate distress.
    const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'self-harm', 'no reason to live', 'hopeless'];
    if (crisisKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        response.text = "It sounds like you are in serious distress. It is vital to talk to someone right now. Please reach out to a professional immediately.";
        // Provide critical helpline information.
        response.referral = { name: "Tele MANAS National Helpline", phone: "14416" };
        return res.status(200).json(response);
    }
    
    // --- Rule-Based Coping Strategies ---
    // Matches keywords to provide specific, actionable advice.
    if (lowerCaseMessage.includes('anxious') || lowerCaseMessage.includes('stress') || lowerCaseMessage.includes('overwhelmed')) {
        response.text = "Feeling anxious is tough. A simple grounding technique can help. Try to name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.";
    } else if (lowerCaseMessage.includes('sad') || lowerCaseMessage.includes('depressed') || lowerCaseMessage.includes('lonely')) {
        response.text = "I'm sorry you're feeling down. Sometimes, taking one small step can make a difference. Could you try stepping outside for a minute of fresh air or listening to one favorite song?";
    } else if (lowerCaseMessage.includes('exam') || lowerCaseMessage.includes('academic') || lowerCaseMessage.includes('study')) {
        response.text = "Academic pressure can be overwhelming. Breaking tasks into smaller, 25-minute focused sessions (like the Pomodoro Technique) can make them feel more manageable. Remember to take short breaks.";
    } else if (lowerCaseMessage.includes('sleep') || lowerCaseMessage.includes('tired')) {
        response.text = "Poor sleep can affect everything. Have you considered a 'wind-down' routine? Try to avoid screens for an hour before bed and do something relaxing like reading or listening to calm music.";
    }

    res.status(200).json(response);
};

