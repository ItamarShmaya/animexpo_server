import mongoose from "mongoose";
import { ProfileData } from "./profileData.js";

const reviewSchema = new mongoose.Schema(
  {
    mal_id: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      trim: true,
    },

    progress: {
      type: Number,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },

    text: {
      type: String,
      required: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

reviewSchema.pre("save", async function (next) {
  const review = this;

  const ownerProfile = await ProfileData.findOne({ owner: review.author });
  ownerProfile.personalInfo.reviewsCount += 1;
  await ownerProfile.save();

  next();
});

export const Review = mongoose.model("reviews", reviewSchema);
