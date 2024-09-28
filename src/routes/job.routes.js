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
/**
 * @swagger
 * tags:
 *   - name: Jobs
 *     description: Job management operations
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - company
 *         - position
 *         - applicationStatus
 *         - workType
 *         - workLocation
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Job collection
 *         company:
 *           type: string
 *           description: The name of the company
 *         position:
 *           type: string
 *           description: The position that is available
 *         applicationStatus:
 *           type: string
 *           enum:
 *             - pending
 *             - interview
 *             - reject
 *           description: The current status of the applicant
 *         workType:
 *           type: string
 *           enum:
 *             - full-time
 *             - part-time
 *             - internship
 *           description: The type of work
 *         workLocation:
 *           type: string
 *           description: The location of the work
 *         createdBy:
 *           type: string
 *           description: The reference of the user who created this job posting
 *       example:
 *         id: DJINWOKJOQ
 *         company: Meta
 *         position: Backend Developer
 *         applicationStatus: pending
 *         workType: full-time
 *         workLocation: Mumbai
 *         createdBy: User(NDIOJNGEIOOI)
 */

router.use(verifyJWT);

// Job routes
/**
 * @swagger
 * /api/v1/job/create-job:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               workLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/get-job:
 *   get:
 *     summary: Retrieve all job postings
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationStatus
 *         in: query
 *         description: Filter by application status
 *         required: false
 *         schema:
 *           type: string
 *       - name: workType
 *         in: query
 *         description: Filter by work type
 *         required: false
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search by job position
 *         required: false
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: Sort the results
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - latest
 *             - oldest
 *             - a-z
 *             - z-a
 *     responses:
 *       200:
 *         description: Successfully fetched all postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalNumberOfPostings:
 *                   type: integer
 *                 numberOfPostingsOnPage:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 numOfPage:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/update-job/{jobId}:
 *   patch:
 *     summary: Update job details
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               workLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/delete-job/{jobId}:
 *   delete:
 *     summary: Delete a job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalJobs:
 *                   type: integer
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 monthlyApplication:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *       500:
 *         description: Internal server error
 */

router.route("/create-job").post(createJob);
router.route("/get-job").get(getAllJobs);
router.route("/update-job/:jobId").patch(updateJobDetails);
router.route("/delete-job/:jobId").delete(deleteJobPosting);
router.route("/stats").get(jobStats);

export default router;
