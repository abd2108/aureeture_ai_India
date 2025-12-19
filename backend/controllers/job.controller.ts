import { Request, Response, NextFunction } from 'express';
import * as JobService from '../services/job.service';

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, location, workModel, skills } = req.query;
        const filters = { location, workModel, skills };
        const jobs = await JobService.getJobs(Number(page), Number(limit), filters);
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const job = await JobService.getJobById(id);
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

export const applyToJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const { id: jobId } = req.params;
        const { coverLetter, resumeUrl } = req.body;
        const application = await JobService.applyToJob(userId, jobId, { coverLetter, resumeUrl });
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

export const getUserApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const applications = await JobService.getUserApplications(userId);
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};



