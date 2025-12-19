import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller';
import { protectRoute } from '../middleware/protectRoute'; // Assuming you have this middleware

/**
 * @name RecommendationRouter
 * @description Defines the API routes for fetching AI-powered user recommendations.
 * @author Your Name <you@aureeture.com>
 * @license Private
 */
const router = express.Router();

/**
 * @route   POST /api/recommendations
 * @desc    Get a ranked list of recommended user connections based on the authenticated user's profile.
 * Accepts optional filter criteria in the request body to refine results.
 * @access  Private (Requires JWT authentication)
 *
 * @body    {
 * "careerGoal"?: "Software Developer", // Optional filter
 * "institution"?: "IIT Varanasi"        // Optional filter
 * }
 *
 * @returns {
 * "status": "success",
 * "data": [
 * { "id": "...", "name": "...", "role": "...", ... },
 * // ... other recommended profiles
 * ]
 * }
 */
router.post(
  '/', // The base path will be '/api/recommendations' as defined in your main server file
  protectRoute, // Middleware: Ensures the user is logged in before proceeding
  getRecommendations // Controller: Contains the core AI matching logic
);

export default router;


