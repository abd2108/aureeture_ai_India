import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import UserProfile, { IUserProfile } from '../models/userProfile.model';
import User from '../models/user.model'; // Assuming you have a main User model
import { OpenAI } from 'openai';
import mongoose from 'mongoose';

// Initialize OpenAI client from environment variables for security
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calculates the cosine similarity between two vectors.
 * This determines how "similar" two project descriptions are in meaning.
 * @param vecA - The first vector (array of numbers).
 * @param vecB - The second vector.
 * @returns A similarity score between -1 and 1.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        return 0;
    }

    let dotProduct = 0.0;
    let magnitudeA = 0.0;
    let magnitudeB = 0.0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * GET /api/recommendations
 * Fetches and ranks user profiles based on AI-powered project similarity and keyword filters.
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
    // We get the authenticated user's ID from the protectRoute middleware
    const currentUserId = (req as any).user._id;

    // Optional filters from the frontend
    const { careerGoal, institution } = req.body;

    // 1. Fetch the current user's profile to get their project embedding
    const currentUserProfile = await UserProfile.findOne({ userId: currentUserId });

    if (!currentUserProfile || !currentUserProfile.projectEmbedding || currentUserProfile.projectEmbedding.length === 0) {
        res.status(404);
        throw new Error("Your profile is not set up for recommendations. Please add a project description.");
    }

    // 2. Build the query for finding other users
    const query: mongoose.FilterQuery<IUserProfile> = {
        userId: { $ne: currentUserId },
        projectEmbedding: { $exists: true, $ne: [] } // Ensure other users are also ready for matching
    };

    // Add optional keyword filters to the database query
    if (careerGoal) {
        query.careerGoal = careerGoal;
    }
    if (institution) {
        query.institution = institution;
    }

    // 3. Fetch all other profiles that match the filters
    // We .populate() to get linked data from the main 'User' model (like name, avatar)
    const otherProfiles = await UserProfile.find(query).populate({
        path: 'userId',
        model: User,
        select: 'name avatar' // Select only the fields needed for the frontend card
    });

    // 4. Calculate AI similarity score for each profile
    const recommendations = otherProfiles.map(profile => {
        const similarityScore = cosineSimilarity(
            currentUserProfile.projectEmbedding!,
            profile.projectEmbedding!
        );

        // Return a clean object formatted for the frontend
        return {
            // @ts-ignore - Populated fields might not be recognized by default TS
            id: profile.userId._id,
            // @ts-ignore
            name: profile.userId.name,
            // @ts-ignore
            avatar: profile.userId.avatar,
            role: profile.careerGoal, // Using careerGoal as role
            company: profile.institution || 'N/A', // Using institution as company
            location: 'Location placeholder', // You would add this field to your User/UserProfile model
            skills: profile.skills,
            mutualConnections: Math.floor(Math.random() * 20), // Placeholder for mutuals
            _aiScore: similarityScore // Keep the score for sorting
        };
    });

    // 5. Sort recommendations by the AI score in descending order
    recommendations.sort((a, b) => b._aiScore - a._aiScore);
    
    // Optional: Limit the number of results
    const topRecommendations = recommendations.slice(0, 20);

    res.status(200).json(topRecommendations);
});

/**
 * This is a utility service function, not a controller.
 * It should be called from your user profile update controller AFTER a user saves their profile.
 * It generates a vector embedding for the user's project description.
 */
export const generateAndSaveEmbedding = async (userProfileId: string): Promise<void> => {
    try {
        const userProfile = await UserProfile.findById(userProfileId);
        if (!userProfile || !userProfile.currentProject) {
            console.warn(`Profile or project description not found for ID: ${userProfileId}`);
            return;
        }

        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: userProfile.currentProject,
            encoding_format: "float",
        });

        userProfile.projectEmbedding = response.data[0].embedding;
        await userProfile.save();
        console.log(`Embedding generated and saved for profile ID: ${userProfileId}`);

    } catch (error) {
        console.error("Error generating or saving embedding:", error);
        // Do not re-throw error to avoid crashing the profile update flow
    }
};


