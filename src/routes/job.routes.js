import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createJob,
  deleteJobPosting,
  getAllJobs,
  jobStats,
  updateJobDetails,
} from "../controllers/job.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-job").post(createJob);
router.route("/get-job").get(getAllJobs);
router.route("/update-job/:jobId").patch(updateJobDetails);
router.route("/delete-job/:jobId").delete(deleteJobPosting);
router.route("/stats").get(jobStats);

export default router;
