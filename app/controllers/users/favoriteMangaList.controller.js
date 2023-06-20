import { FavMangaList } from "../../../db/models/favoriteManga.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addToFavMangaList = async (req, res) => {
  try {
    const favMangaList = await FavMangaList.findOne({ owner: req.user._id });
    const dupe = favMangaList.list.find((entry) => entry.id === req.body.id);

    if (dupe) {
      return res.send(favMangaList);
    }

    favMangaList.list.push(req.body);
    const updatedFavMangaList = await favMangaList.save();
    res.send(updatedFavMangaList);
  } catch (e) {
    if (e.message === errorMessage.MANGA_DUPE)
      return res.status(404).send(errorCode.MANGA_DUPE);

    console.log(e);
    res.send(e);
  }
};

export const removeFromFavMangaList = async (req, res) => {
  const { id } = req.body;
  try {
    const favMangaList = await FavMangaList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { id } } },
      { new: true }
    );
    res.send(favMangaList);
  } catch (e) {
    console.log(e);
  }
};
