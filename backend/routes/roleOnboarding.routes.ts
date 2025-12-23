import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  upsertMentor,
  upsertStudent,
  upsertFounder,
  getMentorProfile,
  getMentorOnboardingStatus,
} from "../controllers/roleOnboarding.controller";

const router = Router();

router.use(requireAuth);

router.get("/mentor", getMentorProfile);
router.get("/mentor/status", getMentorOnboardingStatus);
router.post("/mentor", upsertMentor);
router.patch("/mentor", upsertMentor);
router.post("/student", upsertStudent);
router.post("/founder", upsertFounder);

export default router;

