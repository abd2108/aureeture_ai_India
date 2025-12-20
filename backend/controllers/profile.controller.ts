import { Request, Response, NextFunction } from 'express';
import * as ProfileService from '../services/profile.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const profile = await ProfileService.getUserProfile(userId);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const profileData = req.body;
        const profile = await ProfileService.createUserProfile(userId, profileData);
        res.status(201).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const updateData = req.body;
        const profile = await ProfileService.updateUserProfile(userId, updateData);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};



