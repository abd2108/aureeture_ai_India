import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/user.model';
import Profile from '../models/profile.model';
import Mentorship from '../models/mentorship.model';

interface ProfileStatus {
    userId: string;
    profileExists: boolean;
    onboardingComplete: boolean;
}

export const verifyUserAndGetProfileStatus = async (token: string): Promise<ProfileStatus> => {
    // This is a simplified example. For production, you'd use Clerk's official backend SDK verification methods.
    // The client-side token should be verified using the Clerk Secret Key.
    // The actual verification is handled by the authMiddleware for protected routes.
    // This endpoint is for the initial handshake after login.
    
    const client = await clerkClient.clients.verifyClient(token);
    const user = await clerkClient.users.getUser(client.sessions[0].userId);
    
    if (!user || !user.id) {
        throw new Error('User verification failed.');
    }

    // Find or create the user in our database
    let localUser = await User.findOne({ clerkId: user.id });
    if (!localUser) {
        localUser = await User.create({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.imageUrl,
        });
    }

    // --- Mentorship invite claiming (registered mentor/mentee visibility) ---
    // If this user was previously invited as a mentee by email, attach their Clerk userId
    // so both sides can see the relationship after the mentee registers.
    const email = user.emailAddresses[0].emailAddress.toLowerCase();
    await Mentorship.updateMany(
        { menteeEmail: email, $or: [{ menteeClerkId: { $exists: false } }, { menteeClerkId: null }, { menteeClerkId: '' }] },
        { $set: { menteeClerkId: user.id, status: 'active' } }
    ).catch(() => undefined);

    // Check if a profile exists
    const profile = await Profile.findOne({ userId: localUser._id });

    return {
        userId: localUser._id.toString(),
        profileExists: !!profile,
        onboardingComplete: profile?.onboardingComplete || false,
    };
};



