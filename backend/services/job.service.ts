import Job from '../models/job.model';
import JobApplication from '../models/jobApplication.model';
import User from '../models/user.model';

export const getJobs = async (page: number, limit: number, filters: any) => {
    const skip = (page - 1) * limit;
    const query: any = { isActive: true };

    // Apply filters
    if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.workModel) {
        query.workModel = filters.workModel;
    }
    if (filters.skills) {
        const skillsArray = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
        query.skills = { $in: skillsArray };
    }

    const jobs = await Job.find(query)
        .populate('postedBy', 'name avatar')
        .sort({ postedAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Job.countDocuments(query);

    return {
        jobs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getJobById = async (jobId: string) => {
    const job = await Job.findById(jobId)
        .populate('postedBy', 'name avatar')
        .populate('applications', 'applicantId status appliedAt');

    if (!job) {
        throw new Error('Job not found');
    }

    return job;
};

export const applyToJob = async (userId: string, jobId: string, applicationData: { coverLetter?: string; resumeUrl?: string }) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
        jobId,
        applicantId: user._id
    });

    if (existingApplication) {
        throw new Error('You have already applied to this job');
    }

    const application = await JobApplication.create({
        jobId,
        applicantId: user._id,
        ...applicationData
    });

    // Add application to job
  //  job.applications.push(application._id );
    await job.save();

    return application.populate('jobId', 'title company');
};

export const getUserApplications = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const applications = await JobApplication.find({ applicantId: user._id })
        .populate('jobId', 'title company location workModel')
        .sort({ appliedAt: -1 });

    return applications;
};



