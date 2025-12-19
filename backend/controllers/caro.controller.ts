import { Request, Response, NextFunction } from 'express';
import * as CaroService from '../services/caro.service';

export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { sessionId, page = 1, limit = 50 } = req.query;
        const history = await CaroService.getChatHistory(userId, sessionId as string, Number(page), Number(limit));
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { message, sessionId, context } = req.body;
        const response = await CaroService.processMessage(userId, message, sessionId, context);
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
};



