import { Request, Response, NextFunction } from 'express';
import * as ProjectService from '../services/project.service';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, difficulty, technologies } = req.query;
        const filters = { difficulty, technologies };
        const projects = await ProjectService.getProjects(Number(page), Number(limit), filters);
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const project = await ProjectService.getProjectById(id);
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

export const joinProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { id: projectId } = req.params;
        const result = await ProjectService.joinProject(userId, projectId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const projects = await ProjectService.getUserProjects(userId);
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
};



