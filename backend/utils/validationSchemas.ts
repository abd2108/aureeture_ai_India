import { z } from 'zod';

export const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string({
      required_error: 'Clerk token is required',
    }),
  }),
});

export const onboardingStepSchema = z.object({
  body: z.object({
      step: z.enum(['personal', 'goal', 'review']),
      payload: z.any() // For production, define a specific shape for each step's payload
  })
});

export const createProfileSchema = z.object({
  body: z.object({
    careerStage: z.string().optional(),
    longTermGoal: z.string().optional(),
    personalInfo: z.object({
      phone: z.string().optional(),
      linkedIn: z.string().optional(),
    }).optional(),
    workHistory: z.array(z.object({
      company: z.string(),
      role: z.string(),
       from: z.string().transform((str: string) => new Date(str)),
       to: z.string().transform((str: string) => new Date(str)).optional(),
      description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
       from: z.string().transform((str: string) => new Date(str)),
       to: z.string().transform((str: string) => new Date(str)).optional(),
    })).optional(),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      link: z.string().optional(),
    })).optional(),
    skills: z.array(z.string()).optional(),
    preferences: z.object({
      location: z.array(z.string()),
      workModel: z.enum(['Remote', 'Hybrid', 'On-site']),
      salaryRange: z.object({
        min: z.number(),
        max: z.number(),
      }),
      openToInternships: z.boolean(),
    }).optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    careerStage: z.string().optional(),
    longTermGoal: z.string().optional(),
    personalInfo: z.object({
      phone: z.string().optional(),
      linkedIn: z.string().optional(),
    }).optional(),
    workHistory: z.array(z.object({
      company: z.string(),
      role: z.string(),
       from: z.string().transform((str: string) => new Date(str)),
       to: z.string().transform((str: string) => new Date(str)).optional(),
      description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
       from: z.string().transform((str: string) => new Date(str)),
       to: z.string().transform((str: string) => new Date(str)).optional(),
    })).optional(),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      link: z.string().optional(),
    })).optional(),
    skills: z.array(z.string()).optional(),
    preferences: z.object({
      location: z.array(z.string()),
      workModel: z.enum(['Remote', 'Hybrid', 'On-site']),
      salaryRange: z.object({
        min: z.number(),
        max: z.number(),
      }),
      openToInternships: z.boolean(),
    }).optional(),
    onboardingComplete: z.boolean().optional(),
  }),
});

export const jobApplicationSchema = z.object({
  body: z.object({
    coverLetter: z.string().optional(),
    resumeUrl: z.string().optional(),
  }),
});

export const connectionRequestSchema = z.object({
  body: z.object({
    recipientId: z.string({
      required_error: 'Recipient ID is required',
    }),
    message: z.string().optional(),
  }),
});

export const connectionResponseSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'declined'], {
      required_error: 'Status is required',
    }),
  }),
});

export const chatMessageSchema = z.object({
  body: z.object({
    message: z.string({
      required_error: 'Message is required',
    }),
    sessionId: z.string({
      required_error: 'Session ID is required',
    }),
    context: z.object({
      careerGoal: z.string().optional(),
      currentFocus: z.string().optional(),
      relatedJobs: z.array(z.string()).optional(),
    }).optional(),
  }),
});
