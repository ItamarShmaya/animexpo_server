import { Review } from "../../../db/models/reviews.js";
import { User } from "../../../db/models/user.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    const entryReviewsList = await Review.find({
      id: req.body.id,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .limit(5);

    res.send(entryReviewsList);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

export const getEntryReviews = async (req, res) => {
  const { limit } = req.query;
  const { id } = req.params;
  try {
    const reviewsList = await Review.find({ id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .limit(limit);
    if (!reviewsList) throw new Error();
    res.send(reviewsList);
  } catch (e) {
    res.status(404).send(e);
  }
};

export const getUserReviews = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const userReviews = await Review.find({ author: user._id }).sort({
      createdAt: "desc",
    });
    res.send(userReviews);
  } catch (e) {
    if (e.message === errorMessage.USER_NOT_FOUND) {
      return res.status(404).send(errorCode.USER_NOT_FOUND);
    }
    res.status(404).send(e);
  }
};
