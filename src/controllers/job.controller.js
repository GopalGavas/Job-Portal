import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Job } from "../models/jobs.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import moment from "moment";

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
  // const jobs = await Job.find({ createdBy: req.user?._id });

  const { applicationStatus, workType, search, sort } = req.query;

  const queryObject = {};

  if (applicationStatus && applicationStatus !== "all") {
    queryObject.applicationStatus = applicationStatus;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  const resultQuery = [
    {
      $match: queryObject,
    },
    {
      $addFields: {
        positionLower: { $toLower: "$position" },
      },
    },
    {
      $sort: {
        ...(sort === "latest" && { createdAt: -1 }),
        ...(sort === "oldest" && { createdAt: 1 }),
        ...(sort === "a-z" && { positionLower: 1 }),
        ...(sort === "z-a" && { positionLower: -1 }),
        ...(sort !== "latest" &&
          sort !== "oldest" &&
          sort !== "a-z" &&
          sort !== "z-a" && { createdAt: -1 }), // Default sort if none match
      },
    },
  ];

  // "Pagination"
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  resultQuery.push({ $skip: skip });
  resultQuery.push({ $limit: limit });

  const jobs = await Job.aggregate(resultQuery);

  //jobsCount
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPage = totalJobs > 0 ? Math.ceil(totalJobs / limit) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalNumberOfPostings: totalJobs,
        numberOfPostingsOnPage: jobs.length,
        jobs,
        numOfPage,
      },
      "All Postings fetched successfully"
    )
  );
});

const updateJobDetails = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { company, position, workLocation } = req.body;

  if (!isValidObjectId(jobId)) {
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

const deleteJobPosting = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.createdBy.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You are not Authorized for this action");
  }

  const deleteJob = await Job.findByIdAndDelete(jobId);

  if (!deleteJob) {
    throw new ApiError(
      500,
      "Failed to delete Job Posting , please try again letter"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job Posting deleted successfully"));
});

const jobStats = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $group: {
        _id: "$applicationStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },

    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalJobs: 0, stats: [], monthlyApplication: [] },
          `No jobs found`
        )
      );
  }

  monthlyApplication = monthlyApplication.map((application) => {
    const {
      _id: { month, year },
      count,
    } = application;

    const date = moment()
      .month(month - 1)
      .year(year)
      .format("MMM Y");

    return { date, count };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalJobs: stats.length, stats, monthlyApplication },
        `jobs fetched successfully`
      )
    );
});

export { createJob, getAllJobs, updateJobDetails, deleteJobPosting, jobStats };
