import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';

export const verifyClerkToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const result = await AuthService.verifyUserAndGetProfileStatus(token);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};



