import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  upsertMentor,
  upsertStudent,
  upsertFounder,
} from "../controllers/roleOnboarding.controller";

const router = Router();

router.use(requireAuth);

router.post("/mentor", upsertMentor);
router.post("/student", upsertStudent);
router.post("/founder", upsertFounder);

export default router;

