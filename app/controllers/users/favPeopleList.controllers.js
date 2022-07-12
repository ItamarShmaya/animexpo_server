import { FavPeopleList } from "../../../db/models/favoritePeople.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addToFavPeopleList = async (req, res) => {
  try {
    const peopleList = await FavPeopleList.findOne({ owner: req.user._id });
    const dupe = peopleList.list.find(
      (person) => person.mal_id === req.body.mal_id
    );

    if (dupe) {
      return res.send(peopleList);
    }
    peopleList.list.push(req.body);
    const updatedPeopleList = await peopleList.save();
    res.send(updatedPeopleList);
  } catch (e) {
    if (e.message === errorMessage.PEOPLE_DUPE)
      return res.status(404).send(errorCode.PEOPLE_DUPE);

    console.log(e);
    res.send(e);
  }
};

export const removeFromFavPeopleList = async (req, res) => {
  const { mal_id } = req.body;
  try {
    const PeopleList = await FavPeopleList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { mal_id } } },
      { new: true }
    );
    res.send(PeopleList);
  } catch (e) {
    console.log(e);
  }
};
