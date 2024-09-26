import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      maxlength: 100,
    },

    applicationStatus: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },

    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },

    workLocation: {
      type: String,
      required: [true, "Work location is required"],
      default: "Mumbai",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
