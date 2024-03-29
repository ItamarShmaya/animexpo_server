import { FavCharsList } from "../../../db/models/favoriteCharacters.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addToFavCharList = async (req, res) => {
  try {
    const characterList = await FavCharsList.findOne({ owner: req.user._id });
    const dupe = characterList.list.find(
      (char) => char.id === req.body.id
    );

    if (dupe) {
      return res.send(characterList);
    }

    characterList.list.push(req.body);
    const updatedCharacterList = await characterList.save();
    res.send(updatedCharacterList);
  } catch (e) {
    if (e.message === errorMessage.CHAR_DUPE)
      return res.status(404).send(errorCode.CHAR_DUPE);

    console.log(e);
    res.send(e);
  }
};

export const removeFromFavCharList = async (req, res) => {
  const { id } = req.body;
  try {
    const characterList = await FavCharsList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { id } } },
      { new: true }
    );
    res.send(characterList);
  } catch (e) {
    console.log(e);
  }
};
