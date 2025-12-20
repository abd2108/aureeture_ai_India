import ChatMessage from '../models/chatMessage.model';
import User from '../models/user.model';
import Profile from '../models/profile.model';

export const getChatHistory = async (userId: string, sessionId: string, page: number, limit: number) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const skip = (page - 1) * limit;
    const query: any = { userId: user._id };
    
    if (sessionId) {
        query.sessionId = sessionId;
    }

    const messages = await ChatMessage.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

    const total = await ChatMessage.countDocuments(query);

    return {
        messages: messages.reverse(), // Reverse to show chronological order
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const processMessage = async (userId: string, message: string, sessionId: string, context?: any) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    // Save user message
    const userMessage = await ChatMessage.create({
        userId: user._id,
        message,
        sender: 'user',
        sessionId,
        context
    });

    // Get user profile for context
    const profile = await Profile.findOne({ userId: user._id });

    // Generate CARO response (simplified - in production, this would call an LLM API)
    const caroResponse = await generateCaroResponse(message, profile, context);

    // Save CARO response
    const caroMessage = await ChatMessage.create({
        userId: user._id,
        message: caroResponse,
        sender: 'caro',
        sessionId,
        context
    });

    return {
        userMessage,
        caroMessage,
        sessionId
    };
};

// Simplified CARO response generation - in production, this would integrate with OpenAI/Claude/etc.
const generateCaroResponse = async (userMessage: string, profile: any, context?: any): Promise<string> => {
    // This is a placeholder implementation
    // In production, you would:
    // 1. Analyze user message intent
    // 2. Use profile data for personalization
    // 3. Call LLM API with proper prompts
    // 4. Return generated response

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
        return `Based on your profile, I can help you explore career opportunities in ${profile?.skills?.join(', ') || 'your field of interest'}. What specific aspect of your career would you like to discuss?`;
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
        return `I see you're interested in skill development! Given your current skills (${profile?.skills?.slice(0, 3)?.join(', ') || 'your background'}), I'd recommend focusing on emerging technologies in your field. Would you like specific course recommendations?`;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return `Hello ${profile?.personalInfo?.name || 'there'}! I'm CARO, your AI career companion. I'm here to help you navigate your career journey. How can I assist you today?`;
    }

    return `I understand you're asking about "${userMessage}". As your AI career companion, I'm here to help with career guidance, skill development, job search strategies, and professional growth. Could you tell me more about what you'd like to explore?`;
};



