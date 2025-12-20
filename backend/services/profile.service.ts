import Profile, { IProfile } from '../models/profile.model';
import User from '../models/user.model';

export const getUserProfile = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (profile) {
        // Manually populate user data
        (profile as any).userId = user;
    }
    return profile;
};

export const createUserProfile = async (userId: string, profileData: Partial<IProfile>) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) return null; // <-- NOT throw

    // Check if profile already exists - if it does, update it instead
    const existingProfile = await Profile.findOne({ userId: user._id });
    if (existingProfile) {
        // Update existing profile instead of throwing error
        return await updateUserProfile(userId, profileData);
    }

    const profile = await Profile.create({
        userId: user._id,
        ...profileData
    });

    return profile.populate('userId', 'name email avatar');
};

export const updateUserProfile = async (userId: string, updateData: Partial<IProfile>) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    let profile = await Profile.findOneAndUpdate(
        { userId: user._id },
        { $set: updateData },
        { new: true, runValidators: true, upsert: true }
    ).populate('userId', 'name email avatar');

    if (!profile) {
        // If still not found after upsert, create it
        profile = await Profile.create({
            userId: user._id,
            ...updateData
        });
        return profile.populate('userId', 'name email avatar');
    }

    return profile;
};


