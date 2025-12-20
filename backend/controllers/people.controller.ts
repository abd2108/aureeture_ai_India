import { Request, Response, NextFunction } from 'express';
import * as PeopleService from '../services/people.service';

export const getPeople = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { page = 1, limit = 10, skills, location } = req.query;
        const filters = { skills, location };
        const people = await PeopleService.getPeopleSuggestions(userId, Number(page), Number(limit), filters);
        res.status(200).json({ success: true, data: people });
    } catch (error) {
        next(error);
    }
};

export const getConnections = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const connections = await PeopleService.getUserConnections(userId);
        res.status(200).json({ success: true, data: connections });
    } catch (error) {
        next(error);
    }
};

export const sendConnectionRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { recipientId, message } = req.body;
        const connection = await PeopleService.sendConnectionRequest(userId, recipientId, message);
        res.status(201).json({ success: true, data: connection });
    } catch (error) {
        next(error);
    }
};

export const respondToConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { id: connectionId } = req.params;
        const { status } = req.body;
        const connection = await PeopleService.respondToConnectionRequest(userId, connectionId, status);
        res.status(200).json({ success: true, data: connection });
    } catch (error) {
        next(error);
    }
};



