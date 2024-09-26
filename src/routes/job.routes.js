import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createJob,
  getAllJobs,
  updateJobDetails,
} from "../controllers/job.controller.js";

const router = Router();

router.route("/create-job").post(verifyJWT, createJob);
router.route("/get-job").get(verifyJWT, getAllJobs);
router.route("/update-job/:jobId").patch(verifyJWT, updateJobDetails);

export default router;
