import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Job } from "../models/jobs.model.js";
import mongoose from "mongoose";

const createJob = asyncHandler(async (req, res) => {
  const { company, position, workLocation } = req.body;

  if (!company || !position || !workLocation) {
    throw new ApiError(
      400,
      "Company Name, Position and Work-Location details are required"
    );
  }

  const job = await Job.create({
    company,
    position,
    workLocation,
    createdBy: req.user?._id,
  });

  if (!job) {
    throw new ApiError(500, "Failed to create job posting. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job Posting created successfully"));
});

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user?._id });

  if (!jobs) {
    throw new ApiError(404, "Can't find all the job  postings");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numberOfPostings: jobs.length,
        jobs,
      },
      "All Postings fetched successfully"
    )
  );
});

const updateJobDetails = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { company, position, workLocation } = req.body;

  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Enter a valid JobId");
  }

  if (!company && !position && !workLocation) {
    throw new ApiError(
      400,
      "Provide at least one field to update (company, position, or work location)"
    );
  }

  if (
    [company, position, workLocation].some((fields) => fields?.trim() === "")
  ) {
    throw new ApiError(400, "Fields cannot be empty");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.createdBy.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You are not authorized for this action");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      $set: {
        ...(company && { company }),
        ...(position && { position }),
        ...(workLocation && { workLocation }),
      },
    },
    {
      new: true,
    }
  );

  if (!updatedJob) {
    throw new ApiError(
      500,
      "Failed to update Job Posting, please try again later"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job Posting updated successfully"));
});

export { createJob, getAllJobs, updateJobDetails };
