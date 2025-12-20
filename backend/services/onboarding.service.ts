import Profile from '../models/profile.model';
import User from '../models/user.model';

export const getOnboardingStatus = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const profile = await Profile.findOne({ userId: user._id });
    
    return {
        hasProfile: !!profile,
        onboardingComplete: profile?.onboardingComplete || false,
        currentStep: profile ? (profile.onboardingComplete ? 'completed' : 'in-progress') : 'not-started'
    };
};

export const processOnboardingStep = async (userId: string, step: string, payload: any) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    let profile = await Profile.findOne({ userId: user._id });

    switch (step) {
        case 'personal':
            if (!profile) {
                profile = await Profile.create({
                    userId: user._id,
                    personalInfo: payload.personalInfo || {},
                    careerStage: payload.careerStage,
                    education: payload.education || [],
                    workHistory: payload.workHistory || []
                });
            } else {
                profile.personalInfo = { ...profile.personalInfo, ...payload.personalInfo };
                profile.careerStage = payload.careerStage;
                profile.education = payload.education || profile.education;
                profile.workHistory = payload.workHistory || profile.workHistory;
                await profile.save();
            }
            break;

        case 'goal':
            if (!profile) {
                throw new Error('Profile not found. Complete personal step first.');
            }
            profile.longTermGoal = payload.longTermGoal;
            profile.skills = payload.skills || [];
            profile.preferences = { ...profile.preferences, ...payload.preferences };
            await profile.save();
            break;

        case 'review':
            if (!profile) {
                throw new Error('Profile not found. Complete previous steps first.');
            }
            profile.onboardingComplete = true;
            await profile.save();
            break;

        default:
            throw new Error('Invalid onboarding step');
    }

    return {
        step,
        completed: step === 'review',
        profile: await profile.populate('userId', 'name email avatar')
    };
};



