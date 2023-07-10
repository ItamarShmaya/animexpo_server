import { Notification } from "../../../db/models/notifications.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notificationsList = await Notification.find({
      recipient: req.user._id,
      read: false,
    })
      .sort({ createdAt: "desc" })
      .populate({ path: "requester", select: "username avatar" });
    if (!notificationsList) throw new Error();
    res.send(notificationsList);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
};

export const updateNotificationsToRead = async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.status(200).send({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: e });
  }
};
