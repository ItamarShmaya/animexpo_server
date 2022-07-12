import { Notification } from "../../db/models/notifications.js";
import { User } from "../../db/models/user.js";

export const getUserNotifications = async (username) => {
  try {
    const user = await User.findOne({ username });
    const notifs = await Notification.find({
      recipient: user._id,
      read: false,
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "requester",
        select: "username avatar",
      });
    return notifs;
  } catch (e) {
    console.log(e);
  }
};
