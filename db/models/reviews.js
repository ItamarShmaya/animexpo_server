import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    mal_id: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("reviews", reviewSchema);
