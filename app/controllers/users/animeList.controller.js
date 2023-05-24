import { AnimeList } from "../../../db/models/animeList.js";
import { User } from "../../../db/models/user.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const getUserAnimeList = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const animeList = await AnimeList.findOne({ owner: user._id });
    res.send(animeList);
  } catch (e) {
    if (e.message === errorMessage.USER_NOT_FOUND) {
      res.status(404).send(errorCode.USER_NOT_FOUND);
    }
  }
};

export const addToAnimeList = async (req, res) => {
  try {
    const animeList = await AnimeList.findOne({ owner: req.user._id });
    const dupe = animeList.list.find(
      (anime) => anime.mal_id === req.body.mal_id
    );

    if (dupe) {
      return res.send(animeList);
    }

    animeList.list.push(req.body);
    const updatedAnimeList = await animeList.save();
    res.send(updatedAnimeList);
  } catch (e) {
    res.send(e);
  }
};

export const removeFromAnimeList = async (req, res) => {
  const { mal_id } = req.body;
  try {
    const animeList = await AnimeList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { mal_id } } },
      { new: true }
    );
    res.send(animeList);
  } catch (e) {
    console.log(e);
  }
};

export const updateAnimeEntry = async (req, res) => {
  try {
    const animeList = await AnimeList.findOne({ owner: req.user._id });
    const updatedAnimeEntry = animeList.list.id(req.body._id).set(req.body);
    const updatedList = await animeList.save();
    // res.send({ updatedList, updatedAnimeEntry });
    res.send(updatedAnimeEntry);
  } catch (e) {
    console.log(e);
  }
};
