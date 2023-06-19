import { FavStaffList } from "../../../db/models/favoriteStaff.js";
import { errorCode, errorMessage } from "../../errors/error.js";

export const addToFavStaffList = async (req, res) => {
  try {
    const staffList = await FavStaffList.findOne({ owner: req.user._id });
    const dupe = staffList.list.find(
      (staff) => staff.id === req.body.id
    );

    if (dupe) {
      return res.send(staffList);
    }
    staffList.list.push(req.body);
    const updatedStaffList = await staffList.save();
    res.send(updatedStaffList);
  } catch (e) {
    if (e.message === errorMessage.STAFF_DUPE)
      return res.status(404).send(errorCode.STAFF_DUPE);

    console.log(e);
    res.send(e);
  }
};

export const removeFromFavStaffList = async (req, res) => {
  const { id } = req.body;
  try {
    const staffList = await FavStaffList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { id } } },
      { new: true }
    );
    res.send(staffList);
  } catch (e) {
    console.log(e);
  }
};
