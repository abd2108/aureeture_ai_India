import User from '../models/user.model';
import Mentor from '../models/mentor.model';
import Profile from '../models/profile.model';
import Connection from '../models/connection.model';

export const getPeopleSuggestions = async (userId: string, page: number, limit: number, filters: any) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    // Only suggest mentors: gather mentor userIds
    const mentorDocs = await Mentor.find({}, { userId: 1 }).lean();
    const mentorUserIds = mentorDocs.map((m: any) => String(m.userId)).filter(Boolean);

    const skip = (page - 1) * limit;
    const query: any = {
        userId: {
            $ne: user._id,
            ...(mentorUserIds.length ? { $in: mentorUserIds } : {}),
        },
    };

    // Apply filters
    if (filters.skills) {
        const skillsArray = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
        query.skills = { $in: skillsArray };
    }
    if (filters.location) {
        query['preferences.location'] = { $in: [filters.location] };
    }

    // Get existing connections to exclude them
    const existingConnections = await Connection.find({
        $or: [
            { requester: user._id },
            { recipient: user._id }
        ]
    });

    const connectedUserIds = existingConnections.map(conn => 
        conn.requester.toString() === user._id.toString() ? conn.recipient : conn.requester
    );

    query.userId = {
        $nin: [...connectedUserIds, user._id],
        ...(mentorUserIds.length ? { $in: mentorUserIds } : {}),
    };

    const profiles = await Profile.find(query)
        .populate('userId', 'name avatar email')
        .skip(skip)
        .limit(limit);

    const total = await Profile.countDocuments(query);

    return {
        people: profiles,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getUserConnections = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const connections = await Connection.find({
        $or: [
            { requester: user._id },
            { recipient: user._id }
        ],
        status: 'accepted'
    })
    .populate('requester', 'name avatar email')
    .populate('recipient', 'name avatar email')
    .sort({ updatedAt: -1 });

    // Format connections to show the other person
    const formattedConnections = connections.map(conn => {
        const otherUser = conn.requester._id.toString() === user._id.toString() 
            ? conn.recipient 
            : conn.requester;
        
        return {
            _id: conn._id,
            user: otherUser,
            connectedAt: conn.updatedAt,
            status: conn.status
        };
    });

    return formattedConnections;
};

export const sendConnectionRequest = async (requesterId: string, recipientId: string, message?: string) => {
    const requester = await User.findOne({ clerkId: requesterId });
    if (!requester) {
        throw new Error('Requester not found');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        throw new Error('Recipient not found');
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
        $or: [
            { requester: requester._id, recipient: recipientId },
            { requester: recipientId, recipient: requester._id }
        ]
    });

    if (existingConnection) {
        throw new Error('Connection request already exists or users are already connected');
    }

    const connection = await Connection.create({
        requester: requester._id,
        recipient: recipientId,
        message,
        status: 'pending'
    });

    return connection.populate(['requester', 'recipient'], 'name avatar email');
};

export const respondToConnectionRequest = async (userId: string, connectionId: string, status: 'accepted' | 'declined') => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
        throw new Error('Connection request not found');
    }

    // Verify user is the recipient
    if (connection.recipient.toString() !== user._id.toString()) {
        throw new Error('Unauthorized to respond to this connection request');
    }

    connection.status = status;
    await connection.save();

    return connection.populate(['requester', 'recipient'], 'name avatar email');
};



