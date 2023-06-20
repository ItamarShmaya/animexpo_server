import { FavAnimeList } from "../../../db/models/favoriteAnime.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addToFavAnimeList = async (req, res) => {
  try {
    const favAnimeList = await FavAnimeList.findOne({ owner: req.user._id });
    const dupe = favAnimeList.list.find((entry) => entry.id === req.body.id);

    if (dupe) {
      return res.send(favAnimeList);
    }

    favAnimeList.list.push(req.body);
    const updatedFavAnimeList = await favAnimeList.save();
    res.send(updatedFavAnimeList);
  } catch (e) {
    if (e.message === errorMessage.ANIME_DUPE)
      return res.status(404).send(errorCode.ANIME_DUPE);

    console.log(e);
    res.send(e);
  }
};

export const removeFromFavAnimeList = async (req, res) => {
  const { id } = req.body;
  try {
    const favAnimeList = await FavAnimeList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { id } } },
      { new: true }
    );
    res.send(favAnimeList);
  } catch (e) {
    console.log(e);
  }
};
