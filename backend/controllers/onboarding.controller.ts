import { Request, Response, NextFunction } from 'express';
import * as OnboardingService from '../services/onboarding.service';

export const getOnboardingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const status = await OnboardingService.getOnboardingStatus(userId);
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        next(error);
    }
};

export const submitOnboardingStep = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { step, payload } = req.body;
        const result = await OnboardingService.processOnboardingStep(userId, step, payload);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};



