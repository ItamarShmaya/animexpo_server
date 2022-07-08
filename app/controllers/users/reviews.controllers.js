import { Review } from "../../../db/models/reviews.js";

export const addReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    const entryReviewsList = await Review.find({
      mal_id: req.body.mal_id,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        select: "username profileData",
        populate: "profileData",
      })
      .limit(5);

    res.send(entryReviewsList);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getEntryReviews = async (req, res) => {
  const { limit } = req.query;
  const { mal_id } = req.params;
  try {
    const reviewsList = await Review.find({ mal_id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        select: "username profileData",
        populate: "profileData",
      })
      .limit(limit || null);
    if (!reviewsList) throw new Error();
    res.send(reviewsList);
  } catch (e) {
    res.status(404).send(e);
  }
};
