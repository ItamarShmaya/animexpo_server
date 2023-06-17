import { MangaList } from "../../../db/models/mangaList.js";
import { User } from "../../../db/models/user.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const getUserMangaList = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const mangalist = await MangaList.findOne({ owner: user._id });
    res.send(mangalist);
  } catch (e) {
    if (e.message === errorMessage.USER_NOT_FOUND) {
      res.status(404).send(errorCode.USER_NOT_FOUND);
    }
  }
};

export const addToMangaList = async (req, res) => {
  try {
    const mangalist = await MangaList.findOne({ owner: req.user._id });
    const dupe = mangalist.list.find(
      (manga) => manga.id === req.body.id
    );

    if (dupe) {
      return res.send(mangalist);
    }

    mangalist.list.push(req.body);
    const updatedMangaList = await mangalist.save();
    res.send(updatedMangaList);
  } catch (e) {
    res.send(e);
  }
};

export const removeFromMangaList = async (req, res) => {
  const { id } = req.body;
  try {
    const mangaList = await MangaList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { id } } },
      { new: true }
    );
    res.send(mangaList);
  } catch (e) {
    console.log(e);
  }
};

export const updateMangaEntry = async (req, res) => {
  try {
    const mangaList = await MangaList.findOne({ owner: req.user._id });
    const updatedMangaEntry = mangaList.list.id(req.body._id).set(req.body);
    const updatedMangaList = await mangaList.save();
    res.send(updatedMangaEntry);
  } catch (e) {
    console.log(e);
  }
};
